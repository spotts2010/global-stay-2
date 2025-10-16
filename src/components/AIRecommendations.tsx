'use client';

import { useState } from 'react';
import { Bot, Loader2 } from '@/lib/icons';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { handleGetRecommendations } from '@/app/actions/ai-actions';

const AIRecommendations = () => {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setRecommendation('');

    const formData = new FormData(event.currentTarget);
    const searchHistory = formData.get('searchHistory') as string;
    const preferences = formData.get('preferences') as string;

    const result = await handleGetRecommendations({ searchHistory, preferences });

    if ('error' in result) {
      setError(result.error);
    } else if (result.recommendations) {
      setRecommendation(result.recommendations);
    }

    setLoading(false);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            AI Assistant
          </CardTitle>
          <CardDescription>
            Let our AI suggest accommodations based on your search history and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="search-history">Search History</Label>
            <Textarea
              id="search-history"
              name="searchHistory"
              placeholder="e.g., 'Villas in Malibu', 'apartments in New York with a gym'"
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="preferences">Preferences</Label>
            <Textarea
              id="preferences"
              name="preferences"
              placeholder="e.g., 'Looking for a quiet place with a pool', 'pet-friendly'"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">Powered by Generative AI</p>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Thinking...
              </>
            ) : (
              'Get Recommendations'
            )}
          </Button>
        </CardFooter>
      </form>
      {(recommendation || error) && (
        <CardContent>
          <div className="mt-4 p-4 bg-secondary/50 rounded-lg border">
            {error && <p className="text-destructive font-medium">{error}</p>}
            {recommendation && (
              <div>
                <h4 className="font-bold mb-2">Here are some suggestions:</h4>
                <p className="text-sm whitespace-pre-wrap">{recommendation}</p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AIRecommendations;
