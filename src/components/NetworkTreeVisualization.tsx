import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { referralService, NetworkMember } from "@/services/referralService";
import { Users, TrendingUp, Award } from "lucide-react";

interface NetworkTreeVisualizationProps {
  userId: string;
}

export function NetworkTreeVisualization({
  userId,
}: NetworkTreeVisualizationProps) {
  const [networkData, setNetworkData] = useState<NetworkMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNetworkTree();
  }, [userId]);

  const loadNetworkTree = async () => {
    setLoading(true);
    const data = await referralService.getNetworkTree(userId);
    setNetworkData(data);
    setLoading(false);
  };

  const getLevelColor = (level: number) => {
    const colors = [
      "bg-cyan-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-orange-500",
      "bg-green-500",
      "bg-blue-500",
    ];
    return colors[level] || "bg-slate-500";
  };

  const groupByLevel = (members: NetworkMember[]) => {
    const grouped: { [key: number]: NetworkMember[] } = {};
    members.forEach((member) => {
      if (!grouped[member.level]) grouped[member.level] = [];
      grouped[member.level].push(member);
    });
    return grouped;
  };

  const grouped = groupByLevel(networkData);
  const totalInvestment = networkData.reduce(
    (sum, m) => sum + m.investmentTotal,
    0
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-slate-400">Loading network tree...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/20 rounded-lg">
                <Users className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Network</p>
                <p className="text-2xl font-bold">{networkData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Network Investment</p>
                <p className="text-2xl font-bold">
                  ₹{totalInvestment.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Award className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Active Levels</p>
                <p className="text-2xl font-bold">
                  {Object.keys(grouped).length - 1}/6
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level-wise Network */}
      <Card>
        <CardHeader>
          <CardTitle>6-Level Network Tree</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(grouped).map(([level, members]) => {
            const levelNum = parseInt(level);
            if (levelNum === 0) return null; // Skip self

            return (
              <div key={level} className="space-y-2">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`h-2 w-2 rounded-full ${getLevelColor(levelNum - 1)}`}
                  />
                  <h3 className="font-semibold">
                    Level {levelNum} ({members.length} members)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pl-6">
                  {members.map((member) => (
                    <div
                      key={member.userId}
                      className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all"
                    >
                      <p className="font-medium truncate">{member.fullName}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {member.email}
                      </p>
                      <div className="mt-3 flex justify-between text-sm">
                        <span className="text-slate-400">Investment:</span>
                        <span className="text-cyan-400 font-medium">
                          ₹{member.investmentTotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Referrals:</span>
                        <span className="text-purple-400 font-medium">
                          {member.directReferrals}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {Object.keys(grouped).length === 1 && (
            <div className="text-center py-8 text-slate-400">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No referrals yet. Share your referral link to grow your network!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}