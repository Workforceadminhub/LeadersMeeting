import type { z } from "zod";
import type { workerSchema } from "../schemas/worker";

export type WorkerFormValues = z.infer<typeof workerSchema>;

export type Worker = WorkerFormValues & {
  id?: number | string;
  identifier?: string | null;
  fullname?: string | null;
  fullnamereverse?: string | null;
  fullnamenoothername?: string | null;
  fullnamenoothernamereverse?: string | null;
  email?: string | null;
  updatedat?: string | null;
  ispresent?: boolean | null;
  validate?: boolean | null;
  isactive?: boolean | null;
  isconfirmed?: boolean | null;
  campus?: string | null;
};

export type SelectOption = {
  label: string;
  value: string;
};
