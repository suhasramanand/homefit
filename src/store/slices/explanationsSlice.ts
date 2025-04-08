
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/utils/api';
import { MatchExplanation } from '@/types';

interface ExplanationsState {
  explanations: { [key: string]: MatchExplanation };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  rateLimit: {
    remaining: number;
    resetTime: number | null;
  };
}

const initialState: ExplanationsState = {
  explanations: {},
  status: 'idle',
  error: null,
  rateLimit: {
    remaining: 10, // Default value
    resetTime: null,
  },
};

export const getMatchExplanation = createAsyncThunk(
  'explanations/getMatchExplanation',
  async ({ 
    apartment, 
    preferences, 
    matchScore,
    cacheKey 
  }: { 
    apartment: any; 
    preferences: any; 
    matchScore: number;
    cacheKey: string;
  }, { rejectWithValue }) => {
    try {
      const prompt = `
        I need an explanation for why this apartment is a ${matchScore}% match for a user.
        
        Apartment details:
        - Title: ${apartment.title}
        - Price: $${apartment.price}
        - Location: ${apartment.location.address}, ${apartment.location.city}, ${apartment.location.state}
        - Bedrooms: ${apartment.features.bedrooms}
        - Bathrooms: ${apartment.features.bathrooms}
        - Square Feet: ${apartment.features.squareFeet}
        - Amenities: ${apartment.amenities.join(', ')}
        - Description: ${apartment.description}
        
        User preferences:
        - Budget: $${preferences.budget?.min || 0} - $${preferences.budget?.max || 0}
        - Preferred Locations: ${preferences.location?.join(', ') || 'Any'}
        - Bedrooms: ${preferences.bedrooms || 'Any'}
        - Bathrooms: ${preferences.bathrooms || 'Any'}
        - Desired Amenities: ${preferences.amenities?.join(', ') || 'None specified'}
        
        In 3-4 sentences, explain why this is a ${matchScore}% match. Highlight the strongest matching points and mention any mismatches.
      `;
      
      const response = await fetch(`/api/ai/explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include'
        },
        body: JSON.stringify({ prompt, cacheKey })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Check for rate limiting headers
        const remaining = response.headers.get('X-RateLimit-Remaining');
        const resetTime = response.headers.get('X-RateLimit-Reset');
        
        return rejectWithValue({ 
          message: errorData.message || 'Failed to get explanation',
          rateLimitInfo: {
            remaining: remaining ? parseInt(remaining) : null,
            resetTime: resetTime ? parseInt(resetTime) : null,
          }
        });
      }
      
      const data = await response.json();
      
      // Get rate limit info from headers
      const remaining = response.headers.get('X-RateLimit-Remaining');
      const resetTime = response.headers.get('X-RateLimit-Reset');
      
      return { 
        explanation: data.explanation, 
        cacheKey,
        rateLimitInfo: {
          remaining: remaining ? parseInt(remaining) : null,
          resetTime: resetTime ? parseInt(resetTime) : null,
        }
      };
    } catch (error: any) {
      return rejectWithValue({ message: error.message });
    }
  }
);

const explanationsSlice = createSlice({
  name: 'explanations',
  initialState,
  reducers: {
    setExplanation: (state, action: PayloadAction<{ key: string; explanation: MatchExplanation }>) => {
      state.explanations[action.payload.key] = action.payload.explanation;
    },
    clearExplanations: (state) => {
      state.explanations = {};
    },
    updateRateLimitInfo: (state, action: PayloadAction<{ remaining: number; resetTime: number | null }>) => {
      state.rateLimit = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMatchExplanation.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getMatchExplanation.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.explanations[action.payload.cacheKey] = action.payload.explanation;
        if (action.payload.rateLimitInfo.remaining !== null) {
          state.rateLimit.remaining = action.payload.rateLimitInfo.remaining;
        }
        if (action.payload.rateLimitInfo.resetTime !== null) {
          state.rateLimit.resetTime = action.payload.rateLimitInfo.resetTime;
        }
      })
      .addCase(getMatchExplanation.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload.message;
        
        // Update rate limit info if available
        if (action.payload.rateLimitInfo) {
          if (action.payload.rateLimitInfo.remaining !== null) {
            state.rateLimit.remaining = action.payload.rateLimitInfo.remaining;
          }
          if (action.payload.rateLimitInfo.resetTime !== null) {
            state.rateLimit.resetTime = action.payload.rateLimitInfo.resetTime;
          }
        }
      });
  },
});

export const { setExplanation, clearExplanations, updateRateLimitInfo } = explanationsSlice.actions;

export default explanationsSlice.reducer;
