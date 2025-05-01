"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
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
import { useSelector, useDispatch } from "react-redux";
import { BalldontlieAPI } from "@balldontlie/sdk";
import Select from "react-select";
import { useEffect, useState } from "react";
import { addTeam } from "@/app/store/teamSlice";

const teamCreateSchema = z.object({
  team_name: z.string().min(1, "Team name is required"),
  region: z.string().min(1, "Region is required"),
  country: z.string().min(1, "Country is required"),
  players: z
    .array(z.any())
    .min(1, "Select at least one player")
    .max(10, "You can select up to 10 players")
    .nonempty("Players list cannot be empty"),
});

export function CreateTeamAlert() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [playerOptions, setPlayerOptions] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMorePlayers, setHasMorePlayers] = useState(true);

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
    fetchPlayers(1); // Initial load
  }, []);

  const fetchPlayers = async (pageNum) => {
    if (!hasMorePlayers) return;

    setLoadingPlayers(true);
    try {
      const api = new BalldontlieAPI({
        apiKey: "4965b0d5-e315-4845-b2d4-25122bc0913c",
      });
      const res = await api.nba.getPlayers({ per_page: 10, cursor: pageNum });
      console.log(res);
      const newOptions = res.data.map((player) => ({
        value: player.id,
        label: `${player.first_name} ${player.last_name}`,
      }));
      setPlayerOptions((prev) => [...prev, ...newOptions]);
      if (res.meta.next_cursor === null) {
        setHasMorePlayers(false);
      } else {
        setPage(res.meta.next_cursor);
      }
    } catch (err) {
      console.error("Error fetching players", err);
    } finally {
      setLoadingPlayers(false);
    }
  };

  const handleMenuScrollToBottom = () => {
    if (!loadingPlayers && hasMorePlayers) {
      fetchPlayers(page);
    }
  };

  const onSubmit = (data) => {
    const newTeam = {
      id: Date.now(),
      name: data.team_name,
      region: data.region,
      country: data.country,
      players: data.players,
      playerCount: data.players.length,
    };

    dispatch(addTeam(newTeam));

    form.reset();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Create Team
        </Button>
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
            <FormField
              control={form.control}
              name="players"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Players</FormLabel>
                  <FormControl>
                    <Select
                      isMulti
                      isLoading={loadingPlayers}
                      options={playerOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Choose players..."
                      onMenuScrollToBottom={handleMenuScrollToBottom}
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
