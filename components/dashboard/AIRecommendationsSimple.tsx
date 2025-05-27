'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

export default function AIRecommendationsSimple() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <Brain className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">AI-Powered Recommendations</h2>
          <p className="text-muted-foreground">
            Personalized property suggestions based on your preferences and behavior
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
          <CardDescription>Coming soon...</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This feature is under development.</p>
        </CardContent>
      </Card>
    </div>
  );
}
