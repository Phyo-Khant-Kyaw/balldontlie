"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { BalldontlieAPI } from "@balldontlie/sdk";
import Select from "react-select";
import { useEffect, useState } from "react";

const teamCreateSchema = z.object({
  team_name: z.string().min(1, "Team name is required"),
  region: z.string().min(1, "Region is required"),
  country: z.string().min(1, "Country is required"),
  players: z.array(z.any()).min(1, "Select at least one player"),
});

export function CreateTeamAlert() {
  const user = useSelector((state) => state.auth.user);
  const [playerOptions, setPlayerOptions] = useState([]);

  const form = useForm({
    resolver: zodResolver(teamCreateSchema),
    defaultValues: {
      team_name: "",
      region: "",
      country: "",
      players: [],
    },
  });

  useEffect(() => {
    async function fetchPlayers() {
      const api = new BalldontlieAPI({
        apiKey: "4965b0d5-e315-4845-b2d4-25122bc0913c",
      });
      const playersRes = await api.nba.getPlayers({ per_page: 100 }); // Load more if needed

      // 🔎 Fetch teams and extract used player IDs
      const teamsRes = await fetch("/api/teams");
      const teams = await teamsRes.json();
      const usedPlayerIds = teams.flatMap((team) => team.players);

      // 🧹 Filter out used players
      const options = playersRes.data
        .filter((player) => !usedPlayerIds.includes(player.id))
        .map((player) => ({
          value: player.id,
          label: `${player.first_name} ${player.last_name}`,
        }));

      setPlayerOptions(options);
    }

    fetchPlayers();
  }, []);

  const onSubmit = async (data) => {
    const res = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.team_name,
        region: data.region,
        country: data.country,
        created_by: user,
        players: data.players.map((p) => p.value), // send only player IDs
      }),
    });

    if (!res.ok) {
      console.error("Failed to create team");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Create Team</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create a Team</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 p-4"
          >
            <FormField
              control={form.control}
              name="team_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter team name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter region" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Players MultiSelect */}
            <FormField
              control={form.control}
              name="players"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Players</FormLabel>
                  <FormControl>
                    <Select
                      isMulti
                      options={playerOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Choose players..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button type="submit">Create a Team</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
