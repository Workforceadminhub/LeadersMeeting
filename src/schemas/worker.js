import { z } from "zod";
import { departmentsWithTeams } from "../utils/options";
import { workerrolesoptions } from "../utils/teams";

export const PHONE_LENGTH = 11;

const validRoleValues = workerrolesoptions
  .map((option) => option.value)
  .filter((value) => value !== "All");

export const workerSchema = z
  .object({
    firstname: z.string().trim().min(1, "First name is required"),
    lastname: z.string().trim().min(1, "Last name is required"),
    phonenumber: z
      .string()
      .regex(
        new RegExp(`^\\d{${PHONE_LENGTH}}$`),
        `Phone number must be exactly ${PHONE_LENGTH} digits`
      ),
    team: z
      .string()
      .min(1, "Team is required")
      .refine((value) => value !== "All", "Team is required"),
    department: z.string().min(1, "Department is required"),
    workerrole: z
      .string()
      .min(1, "Role is required")
      .refine(
        (value) => validRoleValues.includes(value),
        "Choose a valid role"
      ),
  })
  .superRefine((data, ctx) => {
    const teamDepartments = departmentsWithTeams[data.team];
    if (!teamDepartments) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["team"],
        message: "Choose a valid team",
      });
      return;
    }
    if (!teamDepartments.includes(data.department)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["department"],
        message: "Choose a department that belongs to the selected team",
      });
    }
  });

export const defaultWorkerValues = {
  firstname: "",
  lastname: "",
  phonenumber: "",
  team: "",
  department: "",
  workerrole: "",
};
