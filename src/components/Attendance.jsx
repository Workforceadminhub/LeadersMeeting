import { useSearchWorker } from "../services/search";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useManualAttendance,
  useWorkerUpdate,
} from "../services/attendance";
import { CheckBadgeIcon } from "@heroicons/react/16/solid";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { capitalize } from "lodash";
import { workerrolesoptions } from "../utils/teams";
import Select from "./Dropdown";
import { departmentsWithTeams, teamsSummary } from "../utils/options";

const emptyPerson = {
  firstname: "",
  lastname: "",
  phonenumber: "",
  department: "",
  team: "",
  fullname: "",
  workerrole: "",
};

const PHONE_LENGTH = 11;
const CONFIRMATION_TIMEOUT_MS = 4500;
const isValidPhone = (value) => /^\d{11}$/.test(value || "");
const onlyDigits = (value) => (value || "").replace(/\D/g, "");

const Attendance = () => {
  const { debouncedSearch, search: searchValue } = useDebouncedSearch();
  const { data: filteredPeople, isLoading } = useSearchWorker(searchValue);
  const { mutate: manualAttendanceMutation } = useManualAttendance();
  const { mutate: updateWorker } = useWorkerUpdate();

  const [query, setQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [manuallySaving, setManuallySaving] = useState(false);
  const [isEditSaving, setIsEditSaving] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const confirmationTimer = useRef(null);
  const queryClient = useQueryClient();

  const [newPerson, setNewPerson] = useState(emptyPerson);
  const [activePerson, setActivePerson] = useState(emptyPerson);
  const [activeTeam, setActiveTeam] = useState(activePerson.team);

  const title =
    "Leaders Meeting with Pastor Mayowa Agboade\nSaturday 18th April 2026";

  useEffect(() => {
    setActiveTeam(activePerson.team);
  }, [activePerson.team]);

  useEffect(() => {
    return () => {
      if (confirmationTimer.current) clearTimeout(confirmationTimer.current);
    };
  }, []);

  const teamOptions = useMemo(
    () => [
      { label: "Choose team", value: "" },
      ...teamsSummary.filter((t) => t.value !== "All"),
    ],
    []
  );

  const roleOptions = useMemo(
    () => [
      { label: "Choose role", value: "" },
      ...workerrolesoptions.filter((o) => o.value !== "All"),
    ],
    []
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value.startsWith("0") ? value.replace(/^0/, "") : value);
  };

  const handleCreate = () => setIsCreating(true);
  const resetCreate = () => {
    setIsCreating(false);
    setNewPerson(emptyPerson);
  };
  const resetEdit = () => {
    setIsEditing(false);
    setActiveTeam("");
  };

  const capitalizeField = (setter, field) => (e) => {
    const value = capitalize(e.target.value.trim());
    setter((prev) => ({ ...prev, [field]: value }));
  };

  const showConfirmation = (person) => {
    setConfirmation({
      name: `${person.firstname || ""} ${person.lastname || ""}`.trim(),
      team: person.team,
      department: person.department,
      role: person.workerrole,
      timestamp: new Date(),
    });
    setQuery("");
    debouncedSearch("");
    if (confirmationTimer.current) clearTimeout(confirmationTimer.current);
    confirmationTimer.current = setTimeout(() => {
      setConfirmation(null);
    }, CONFIRMATION_TIMEOUT_MS);
  };

  const dismissConfirmation = () => {
    if (confirmationTimer.current) clearTimeout(confirmationTimer.current);
    setConfirmation(null);
  };

  const handleSave = () => {
    if (!isCreateFormValid) return;

    setManuallySaving(true);
    const payload = {
      ...newPerson,
      fullname:
        `${newPerson.firstname.trim()} ${newPerson.lastname.trim()}`.trim(),
      ispresent: true,
    };
    manualAttendanceMutation(payload, {
      onSuccess() {
        queryClient.invalidateQueries();
        setNewPerson(emptyPerson);
        setManuallySaving(false);
        setIsCreating(false);
        showConfirmation(payload);
      },
      onError(error) {
        toast.error("Could not save attendance. Try again.");
        setManuallySaving(false);
        throw error;
      },
    });
  };

  const handleUpdate = () => {
    if (!isEditFormValid) return;

    setIsEditSaving(true);
    const payload = {
      ...activePerson,
      fullname:
        `${activePerson.firstname.trim()} ${activePerson.lastname.trim()}`.trim(),
      ispresent: true,
    };
    updateWorker(payload, {
      onSuccess() {
        queryClient.invalidateQueries();
        setActivePerson(emptyPerson);
        setIsEditSaving(false);
        setIsEditing(false);
        showConfirmation(payload);
      },
      onError(error) {
        toast.error("Could not mark attendance. Try again.");
        setIsEditSaving(false);
        throw error;
      },
    });
  };

  const handleEdit = (person) => {
    setIsEditing(true);
    setActivePerson(person);
  };

  const getDepartmentOptions = () => {
    const departments = departmentsWithTeams[activeTeam || activePerson.team];
    const options = departments
      ? departments.map((department) => ({
          label: department,
          value: department,
        }))
      : [];

    return [{ label: "Choose department", value: "" }].concat(options);
  };

  const isPersonFormValid = (person) =>
    Boolean(
      person.firstname?.trim() &&
        person.lastname?.trim() &&
        isValidPhone(person.phonenumber) &&
        person.team &&
        person.team !== "All" &&
        person.department &&
        person.department !== "All" &&
        departmentsWithTeams[person.team]?.includes(person.department) &&
        person.workerrole &&
        person.workerrole !== "All"
    );

  const isCreateFormValid = isPersonFormValid(newPerson);
  const isEditFormValid = isPersonFormValid(activePerson);

  const renderPhoneError = (phonenumber) => {
    if (!phonenumber) return null;
    if (!isValidPhone(phonenumber)) {
      return (
        <p className="mt-1 text-xs text-red-600" role="alert">
          Phone number must be exactly {PHONE_LENGTH} digits
        </p>
      );
    }
    return null;
  };

  const formatTime = (date) =>
    date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen flex flex-col md:items-center bg-gray-50 p-4">
      <div className="lg:w-5/12">
        <header className="text-center mb-4 mt-1">
          <img
            src="/logo.jpg"
            alt="Harvesters International Christian Center Logo"
            className="w-32 h-32 mx-auto"
          />
          <h2 className="text-2xl font-bold text-gray-700 mt-4 whitespace-pre-line">
            {title}
          </h2>
        </header>

        <div className="bg-white shadow-lg rounded-xl p-6 mb-24 mt-12">
          {confirmation ? (
            <div
              role="status"
              aria-live="polite"
              className="flex flex-col items-center text-center py-6"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckBadgeIcon className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">
                Marked present
              </h2>
              <p className="mt-2 text-lg text-gray-800">{confirmation.name}</p>
              <p className="text-sm text-gray-600">
                {confirmation.team}
                {confirmation.department && ` · ${confirmation.department}`}
              </p>
              {confirmation.role && (
                <p className="text-sm text-gray-500">{confirmation.role}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                {formatTime(confirmation.timestamp)}
              </p>
              <button
                onClick={dismissConfirmation}
                className="mt-6 w-full max-w-xs rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Mark next person
              </button>
            </div>
          ) : (
            <>
              {!isEditing && !isCreating && (
                <input
                  type="search"
                  inputMode="search"
                  aria-label="Search by name or phone number"
                  placeholder="Search by name or phone number"
                  className="w-full mb-4 p-2 h-14 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  value={query}
                  onChange={handleSearch}
                />
              )}

              {!isCreating &&
              !isEditing &&
              searchValue &&
              filteredPeople?.length > 0 ? (
                <div>
                  <ul className="space-y-2">
                    {filteredPeople?.map((person, index) => (
                      <li
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg flex justify-between items-center"
                      >
                        <div className="flex flex-col">
                          <span className="text-gray-900">
                            {person.firstname} {person.lastname}
                          </span>
                          {person.workerrole && (
                            <span className="text-gray-600 text-sm">
                              {person.workerrole}
                            </span>
                          )}
                          {person.team ? (
                            <span className="text-gray-500 text-sm">
                              {person.team}
                              {person.department && ` - ${person.department}`}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-sm">
                              {person.team || person.department}
                            </span>
                          )}
                        </div>
                        {person.ispresent ? (
                          <button
                            disabled
                            aria-disabled="true"
                            className="px-2 py-2 text-sm bg-green-500 text-white rounded-lg flex justify-between cursor-not-allowed"
                          >
                            <CheckBadgeIcon className="text-white size-5" />
                            <span className="ml-3">Present</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(person)}
                            className="px-8 py-2 text-sm bg-blue-500 text-white cursor-pointer rounded-lg flex hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          >
                            Open
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="items-center text-center">
                    <div className="mt-6 text-gray-700">OR</div>
                    <button
                      onClick={handleCreate}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                      Manually add attendance
                    </button>
                  </div>
                </div>
              ) : (
                !isCreating &&
                !isEditing && (
                  <div className="text-center my-4">
                    {isLoading && searchValue ? (
                      <p className="text-gray-700">Searching...</p>
                    ) : !isLoading && searchValue ? (
                      <div>
                        <p className="text-gray-700">No results</p>
                        <button
                          onClick={handleCreate}
                          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        >
                          Manually add attendance
                        </button>
                      </div>
                    ) : null}
                  </div>
                )
              )}

              {isCreating && (
                <div className="mt-4">
                  <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
                    Manually add attendance
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="create-firstname"
                        className="text-sm mb-2 block text-gray-700"
                      >
                        First name
                      </label>
                      <input
                        id="create-firstname"
                        type="text"
                        autoComplete="given-name"
                        placeholder="First Name"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={newPerson.firstname}
                        onChange={(e) =>
                          setNewPerson({
                            ...newPerson,
                            firstname: e.target.value,
                          })
                        }
                        onBlur={capitalizeField(setNewPerson, "firstname")}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="create-lastname"
                        className="text-sm mb-2 block text-gray-700"
                      >
                        Last name
                      </label>
                      <input
                        id="create-lastname"
                        type="text"
                        autoComplete="family-name"
                        placeholder="Last Name"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={newPerson.lastname}
                        onChange={(e) =>
                          setNewPerson({
                            ...newPerson,
                            lastname: e.target.value,
                          })
                        }
                        onBlur={capitalizeField(setNewPerson, "lastname")}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="create-phone"
                        className="text-sm mb-2 block text-gray-700"
                      >
                        Phone number
                      </label>
                      <input
                        id="create-phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        pattern="\d{11}"
                        maxLength={PHONE_LENGTH}
                        placeholder="11-digit phone number"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={newPerson.phonenumber}
                        onChange={(e) =>
                          setNewPerson({
                            ...newPerson,
                            phonenumber: onlyDigits(e.target.value).slice(
                              0,
                              PHONE_LENGTH
                            ),
                          })
                        }
                        aria-invalid={
                          newPerson.phonenumber &&
                          !isValidPhone(newPerson.phonenumber)
                            ? true
                            : undefined
                        }
                      />
                      {renderPhoneError(newPerson.phonenumber)}
                    </div>

                    <Select
                      label="Team"
                      options={teamOptions}
                      value={newPerson.team}
                      onChange={(value) => {
                        setActiveTeam(value);
                        setNewPerson({
                          ...newPerson,
                          team: value,
                          department: "",
                        });
                      }}
                      className="mb-3"
                    />

                    <Select
                      label="Department"
                      options={getDepartmentOptions()}
                      value={newPerson.department}
                      onChange={(value) =>
                        setNewPerson({ ...newPerson, department: value || "" })
                      }
                      className="mb-3"
                    />

                    <Select
                      label="Role"
                      options={roleOptions}
                      value={newPerson.workerrole}
                      onChange={(value) =>
                        setNewPerson({ ...newPerson, workerrole: value })
                      }
                      className="mb-3"
                    />

                    <div className="flex space-x-2">
                      <button
                        onClick={resetCreate}
                        className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:outline-none"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          !manuallySaving && isCreateFormValid
                            ? handleSave()
                            : undefined
                        }
                        disabled={!isCreateFormValid || manuallySaving}
                        aria-disabled={!isCreateFormValid || manuallySaving}
                        className={`w-full py-2 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                          !isCreateFormValid || manuallySaving
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                        }`}
                      >
                        {manuallySaving ? "Saving" : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="mt-1">
                  <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
                    Update worker info
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="edit-firstname"
                        className="text-sm mb-2 block text-gray-700"
                      >
                        First name
                      </label>
                      <input
                        id="edit-firstname"
                        type="text"
                        autoComplete="given-name"
                        placeholder="First Name"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={activePerson.firstname}
                        onChange={(e) =>
                          setActivePerson({
                            ...activePerson,
                            firstname: e.target.value,
                          })
                        }
                        onBlur={capitalizeField(setActivePerson, "firstname")}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="edit-lastname"
                        className="text-sm mb-2 block text-gray-700"
                      >
                        Last name
                      </label>
                      <input
                        id="edit-lastname"
                        type="text"
                        autoComplete="family-name"
                        placeholder="Last Name"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={activePerson.lastname}
                        onChange={(e) =>
                          setActivePerson({
                            ...activePerson,
                            lastname: e.target.value,
                          })
                        }
                        onBlur={capitalizeField(setActivePerson, "lastname")}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="edit-phone"
                        className="text-sm mb-2 block text-gray-700"
                      >
                        Phone number
                      </label>
                      <input
                        id="edit-phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        pattern="\d{11}"
                        maxLength={PHONE_LENGTH}
                        placeholder="11-digit phone number"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={activePerson.phonenumber}
                        onChange={(e) =>
                          setActivePerson({
                            ...activePerson,
                            phonenumber: onlyDigits(e.target.value).slice(
                              0,
                              PHONE_LENGTH
                            ),
                          })
                        }
                        aria-invalid={
                          activePerson.phonenumber &&
                          !isValidPhone(activePerson.phonenumber)
                            ? true
                            : undefined
                        }
                      />
                      {renderPhoneError(activePerson.phonenumber)}
                    </div>

                    <Select
                      label="Team"
                      options={teamOptions}
                      value={activePerson.team}
                      onChange={(value) => {
                        setActiveTeam(value);
                        setActivePerson({
                          ...activePerson,
                          team: value,
                          department: "",
                        });
                      }}
                      className="mb-3"
                    />

                    <Select
                      label="Department"
                      options={getDepartmentOptions()}
                      value={activePerson.department}
                      onChange={(value) =>
                        setActivePerson({
                          ...activePerson,
                          department: value || "",
                        })
                      }
                      className="mb-3"
                    />

                    <Select
                      label="Role"
                      options={roleOptions}
                      value={activePerson.workerrole}
                      onChange={(value) =>
                        setActivePerson({ ...activePerson, workerrole: value })
                      }
                      className="mb-3"
                    />

                    <div className="flex space-x-2">
                      <button
                        onClick={resetEdit}
                        className="w-full py-2 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:outline-none"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          !isEditSaving && isEditFormValid
                            ? handleUpdate()
                            : undefined
                        }
                        disabled={!isEditFormValid || isEditSaving}
                        aria-disabled={!isEditFormValid || isEditSaving}
                        className={`w-full py-2 text-white rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                          !isEditFormValid || isEditSaving
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                        }`}
                      >
                        {isEditSaving ? "Marking..." : "Mark Attendance"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
