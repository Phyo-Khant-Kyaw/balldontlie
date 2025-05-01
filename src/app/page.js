"use client";

import {
  Table,
  TableBody,
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
import { CreateTeamAlert } from "./component/CreateTeamAlert";
import { useDispatch, useSelector } from "react-redux";
import { AppNavbar } from "@/components/navbar";
import { DeleteTeamAlert } from "./component/DeleteTeamAlert";
import { UpdateTeamAlert } from "./component/UpdateTeamAlert";
import { logout } from "./store/authSlice";
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const teams = useSelector((state) => state.team);
  const username = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(logout());
  };
  const { error } = useSelector((state) => state.team);

  useEffect(() => {
    if (error) {
      setMessage(error);

      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <>
      <AppNavbar onLogout={onLogout} username={username?.username} />
      <div className="w-full justify-center p-6 md:p-10">
        {message && (
          <Alert className="mb-4 text-red-400 animate-fade-in-out transition-opacity duration-500 max-w-sm">
            <Terminal className="h-4 w-4" />
            <AlertDescription className="text-red-400 font-bold">
              {message}
            </AlertDescription>
          </Alert>
        )}

        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between text-2xl">
                  Teams
                  <CreateTeamAlert />
                </div>
              </CardTitle>
              <CardDescription>
                Manage your basketball teams and players.
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
                  {teams.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No teams created yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    teams.teams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell>{team.name}</TableCell>
                        <TableCell>{team.region}</TableCell>
                        <TableCell>{team.country}</TableCell>
                        <TableCell>{team.playerCount}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DeleteTeamAlert id={team.id} />
                            <UpdateTeamAlert id={team.id} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
