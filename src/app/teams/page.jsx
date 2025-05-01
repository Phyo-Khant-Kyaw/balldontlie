'use client";';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { connectToDatabase } from "@/lib/mongodb";
import Team from "@/models/Team";
import { CreateTeamAlert } from "./component/CreateTeamAlert";

export default async function TeamsPage() {

  return (
    <div className="flex min-h-svh w-full justify-center p-6 md:p-10">
      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center  justify-between text-2xl">
                Teams
                <CreateTeamAlert />
              </div>
            </CardTitle>
            <CardDescription>
              Enter your user name below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Player Count</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* {teams.map((team) => (
                  <TableRow key={team._id}>
                    <TableCell>{team.name}</TableCell>
                    <TableCell>{team.region}</TableCell>
                    <TableCell>{team.country}</TableCell>
                    <TableCell>{team.player_count}</TableCell>
                  </TableRow>
                ))} */}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
