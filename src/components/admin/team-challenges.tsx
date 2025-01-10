"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Target } from "lucide-react";
import {
  getActiveChallenges,
  getChallengeProgress,
} from "@/lib/services/team-challenges";

export function TeamChallenges({ employeeId }: { employeeId?: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChallenges = async () => {
      const activeChallenges = await getActiveChallenges();
      const challengesWithProgress = await Promise.all(
        activeChallenges.map(async (challenge) => {
          const progress = await getChallengeProgress(challenge.id, employeeId);
          return { ...challenge, ...progress };
        })
      );
      setChallenges(challengesWithProgress);
      setLoading(false);
    };

    loadChallenges();
  }, [employeeId]);

  if (loading) return <div>Loading challenges...</div>;

  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <Card key={challenge.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                {challenge.type === "team" ? (
                  <Users className="h-5 w-5" />
                ) : (
                  <Trophy className="h-5 w-5" />
                )}
                {challenge.title}
              </div>
            </CardTitle>
            <Badge variant={challenge.isComplete ? "success" : "secondary"}>
              {challenge.isComplete ? "Completed" : "In Progress"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {challenge.description}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {challenge.progress} / {challenge.target}
                  </span>
                </div>
                <Progress value={challenge.percentComplete} />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>Reward: {challenge.reward}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
