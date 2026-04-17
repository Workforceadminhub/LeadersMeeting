import { useMutation } from "@tanstack/react-query";
import supabase from "./supabase";

const table = "leader"  
const markPresent = async (person) => {
  // const day = getAwakeningDay();
  const isPresentKey = "ispresent";
  const { data: worker } = await supabase
  .from(table)
  .select("*")
    .eq("id", person.id);

  const workerAttendance = worker[0][isPresentKey];

  if (workerAttendance) return worker[0];

  const dateUTC = new Date();
  const dateISO = dateUTC.toISOString();

  const { data, error } = await supabase
    .from(table)
    .update({ [isPresentKey]: true, updatedat: dateISO })
    .eq("id", person.id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const manualAttendance = async (person) => {
  const { data, error } = await supabase
    .from(table)
    .insert({ ...person, validate: true })
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
const updateWorker = async (person) => {
  const { id, ...rest} = person
  const { data, error } = await supabase
    .from(table)
    .update({ ...rest, ispresent: true })
    .eq("id", person.id)
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const mutationDefaults = {
  networkMode: "offlineFirst",
  retry: 3,
  retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 15000),
  gcTime: 0,
};

export const useAttendance = () => {
  return useMutation({
    mutationFn: markPresent,
    ...mutationDefaults,
  });
};

export const useManualAttendance = () => {
  return useMutation({
    mutationFn: manualAttendance,
    ...mutationDefaults,
  });
};

export const useWorkerUpdate = () => {
  return useMutation({
    mutationFn: updateWorker,
    ...mutationDefaults,
  });
};
