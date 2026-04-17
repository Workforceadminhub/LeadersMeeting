import { useEffect, useMemo } from "react";
import {
  Controller,
  useForm,
  useWatch,
  type Control,
  type UseFormSetValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import capitalize from "lodash/capitalize";
import Select from "./Dropdown";
import {
  PHONE_LENGTH,
  defaultWorkerValues,
  workerSchema,
} from "../schemas/worker";
import { departmentsWithTeams, teamsSummary } from "../utils/options";
import { workerrolesoptions } from "../utils/teams";
import type { WorkerFormValues } from "../types";

const onlyDigits = (value: string) => (value || "").replace(/\D/g, "");

type TeamDepartmentSelectsProps = {
  control: Control<WorkerFormValues>;
  setValue: UseFormSetValue<WorkerFormValues>;
};

const TeamDepartmentSelects = ({
  control,
  setValue,
}: TeamDepartmentSelectsProps) => {
  const team = useWatch({ control, name: "team" });

  const teamOptions = useMemo(
    () => [
      { label: "Choose team", value: "" },
      ...teamsSummary.filter((option) => option.value !== "All"),
    ],
    []
  );

  const departmentOptions = useMemo(() => {
    const list = team ? departmentsWithTeams[team] || [] : [];
    return [
      { label: "Choose department", value: "" },
      ...list.map((department) => ({
        label: department,
        value: department,
      })),
    ];
  }, [team]);

  return (
    <>
      <Controller
        control={control}
        name="team"
        render={({ field, fieldState }) => (
          <Select
            label="Team"
            options={teamOptions}
            value={field.value}
            onChange={(value) => {
              field.onChange(value);
              setValue("department", "", { shouldValidate: true });
            }}
            onBlur={field.onBlur}
            hasErrors={Boolean(fieldState.error)}
            error={fieldState.error?.message}
            className="mb-3"
          />
        )}
      />
      <Controller
        control={control}
        name="department"
        render={({ field, fieldState }) => (
          <Select
            label="Department"
            options={departmentOptions}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            hasErrors={Boolean(fieldState.error)}
            error={fieldState.error?.message}
            className="mb-3"
          />
        )}
      />
    </>
  );
};

type WorkerFormProps = {
  mode: "create" | "edit";
  initialValues: Partial<WorkerFormValues> | null;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (values: WorkerFormValues) => void;
  onCancel: () => void;
};

const WorkerForm = ({
  mode,
  initialValues,
  isSubmitting,
  submitLabel,
  onSubmit,
  onCancel,
}: WorkerFormProps) => {
  const roleOptions = useMemo(
    () => [
      { label: "Choose role", value: "" },
      ...workerrolesoptions.filter((option) => option.value !== "All"),
    ],
    []
  );

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<WorkerFormValues>({
    resolver: zodResolver(workerSchema),
    mode: "onTouched",
    defaultValues: { ...defaultWorkerValues, ...initialValues },
  });

  useEffect(() => {
    reset({ ...defaultWorkerValues, ...initialValues });
    // Validate the pre-filled values immediately so isValid reflects
    // reality and any problems (e.g. a 10-digit phone) are surfaced
    // right away instead of only after the user touches a field.
    void trigger();
  }, [initialValues, reset, trigger]);

  const capitalizeOnBlur = (field: "firstname" | "lastname") => () => {
    const current = getValues(field) || "";
    const next = capitalize(current.trim());
    if (next !== current) {
      setValue(field, next, { shouldValidate: true, shouldDirty: true });
    }
  };

  const idPrefix = mode;
  const buttonDisabled = isSubmitting || !isValid;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor={`${idPrefix}-firstname`}
          className="text-sm mb-2 block text-gray-700"
        >
          First name
        </label>
        <input
          id={`${idPrefix}-firstname`}
          type="text"
          autoComplete="given-name"
          placeholder="First Name"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          aria-invalid={errors.firstname ? true : undefined}
          {...register("firstname", {
            onBlur: capitalizeOnBlur("firstname"),
          })}
        />
        {errors.firstname && (
          <p className="mt-1 text-xs text-red-600" role="alert">
            {errors.firstname.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-lastname`}
          className="text-sm mb-2 block text-gray-700"
        >
          Last name
        </label>
        <input
          id={`${idPrefix}-lastname`}
          type="text"
          autoComplete="family-name"
          placeholder="Last Name"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          aria-invalid={errors.lastname ? true : undefined}
          {...register("lastname", {
            onBlur: capitalizeOnBlur("lastname"),
          })}
        />
        {errors.lastname && (
          <p className="mt-1 text-xs text-red-600" role="alert">
            {errors.lastname.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-phone`}
          className="text-sm mb-2 block text-gray-700"
        >
          Phone number
        </label>
        <Controller
          control={control}
          name="phonenumber"
          render={({ field, fieldState }) => (
            <>
              <input
                id={`${idPrefix}-phone`}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                pattern={`\\d{${PHONE_LENGTH}}`}
                maxLength={PHONE_LENGTH}
                placeholder={`${PHONE_LENGTH}-digit phone number`}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={field.value || ""}
                onBlur={field.onBlur}
                onChange={(e) =>
                  field.onChange(
                    onlyDigits(e.target.value).slice(0, PHONE_LENGTH)
                  )
                }
                aria-invalid={fieldState.error ? true : undefined}
              />
              {fieldState.error && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      <TeamDepartmentSelects control={control} setValue={setValue} />

      <Controller
        control={control}
        name="workerrole"
        render={({ field, fieldState }) => (
          <Select
            label="Role"
            options={roleOptions}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            hasErrors={Boolean(fieldState.error)}
            error={fieldState.error?.message}
            className="mb-3"
          />
        )}
      />

      <div className="flex space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={buttonDisabled}
          aria-disabled={buttonDisabled}
          className={`w-full py-2 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
            buttonDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
          }`}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default WorkerForm;
