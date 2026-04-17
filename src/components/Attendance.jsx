import { useSearchWorker } from "../services/search";
import { useDebouncedSearch } from "../hooks/useDebouncedSearch";
import { useEffect, useState } from "react";
import {
  // useAttendance,
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

const Attendance = () => {
  const { debouncedSearch, search: searchValue } = useDebouncedSearch();
  const { data: filteredPeople, isLoading } = useSearchWorker(searchValue);
  // const { mutate: markAttendanceMutation } = useAttendance();
  const { mutate: manualAttendanceMutation } = useManualAttendance();
  const { mutate: updateWorker } = useWorkerUpdate();
  const [query, setQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // const [mutateIsLoadingId, setMutateIsLoadingId] = useState(0);
  const [manuallySaving, setManuallySaving] = useState(false);
  const [isEditSaving, setIsEditSaving] = useState(false);
  const queryClient = useQueryClient();
  const [newPerson, setNewPerson] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    department: "",
    team: "",
    fullname: "",
    workerrole: "",
    // email: "",
  });

  const [activePerson, setActivePerson] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    department: "",
    team: "",
    fullname: "",
    workerrole: ""
    // email: "",
  });

  const [activeTeam, setActiveTeam] = useState(activePerson.team);

  // trigger deployment comment
  const title = "Workers Meeting - Saturday 18th April 2026";

  const handleSearch = (e) => {
    setQuery(e.target.value);
    debouncedSearch(
      e.target.value.startsWith(0)
        ? e.target.value.replace(0, "")
        : e.target.value
    );
  };

  const handleCreate = () => {
    setIsCreating(true);
  };

  const resetCreate = () => {
    setIsCreating(false);
  };

  const resetEdit = () => {
    setIsEditing(false);
    setActiveTeam("");
  };

  useEffect(() => {
    setActiveTeam(activePerson.team);
  }, [activePerson.team]);

  const handleSave = () => {
    if (!newPerson.firstname || !newPerson.lastname) {
      toast.error("First name or last name is missing");
      return;
    }

    if (!newPerson.phonenumber) {
      toast.error("Phone number is missing");
      return;
    }
    if (!newPerson.team || newPerson.team === "All") {
      toast.error("Team is missing");
      return;
    }
    if (!newPerson.department || newPerson.department === "All") {
      toast.error("Department is missing");
      return;
    }
    if (!newPerson.workerrole) {
      toast.error("Role is missing");
      return;
    }

    const isPresentKey = "ispresent";
    setManuallySaving(true);
    manualAttendanceMutation(
      {
        ...newPerson,
        fullname:
          `${newPerson.firstname.trim()} ${newPerson.lastname.trim()}`.trim(),
        [isPresentKey]: true,
      },
      {
        onSuccess() {
          toast.success("Attendance manually added successfully");
          queryClient.invalidateQueries();
          setNewPerson({
            firstname: "",
            lastname: "",
            phonenumber: "",
            department: "",
            team: "",
            fullname: "",
            // email: "",
            workerrole: "",
          });
          setManuallySaving(false);
          setIsCreating(false);
        },
        onError(error) {
          setNewPerson({
            firstname: "",
            lastname: "",
            phonenumber: "",
            department: "",
            team: "",
            fullname: "",
            // email: "",
            workerrole: "",
          });
          setManuallySaving(false);
          setIsCreating(false);
          throw error;
        },
      }
    );
  };

  const handleUpdate = () => {
    if (!activePerson.firstname || !activePerson.lastname) {
      toast.error("First name or last name is missing");
      return;
    }

    if (!activePerson.phonenumber) {
      toast.error("Phone number is missing");
      return;
    }

    if (!activePerson.team || activePerson.team === "All") {
      toast.error("Team is missing");
      return;
    }
    if (!activePerson.department || activePerson.department === "All") {
      toast.error("Department is missing");
      return;
    }
    if (!activePerson.workerrole) {
      toast.error("Role is missing");
      return;
    }
    const isPresentKey = "ispresent";
    setIsEditSaving(true);
    updateWorker(
      {
        ...activePerson,
        fullname:
          `${activePerson.firstname.trim()} ${activePerson.lastname.trim()}`.trim(),
        [isPresentKey]: true,
      },
      {
        onSuccess() {
          toast.success("Attendance manually added successfully");
          queryClient.invalidateQueries();
          setActivePerson({
            firstname: "",
            lastname: "",
            phonenumber: "",
            department: "",
            team: "",
            fullname: "",
            // email: "",
            workerrole: "",
          });
          setIsEditSaving(false);
          setIsEditing(false);
        },
        onError(error) {
          setIsEditSaving(false);
          setIsEditing(false);
          throw error;
        },
      }
    );
  };

  // const handleMarkPresent = (person) => {
  //   setMutateIsLoadingId(person.id);
  //   markAttendanceMutation(person, {
  //     onSuccess() {
  //       toast.success("Attendance marked successfully");
  //       setMutateIsLoadingId(0);
  //       queryClient.invalidateQueries();
  //     },
  //     onError(error) {
  //       setMutateIsLoadingId(0);
  //       throw error;
  //     },
  //   });
  // };

  const handleEdit = (person) => {
    // Implement edit functionality
    setIsEditing(true);
    setActivePerson(person);
  };

  const getDepartment = () => {
    const departments = departmentsWithTeams[activeTeam || activePerson.team];
    const options = departments
      ? departments.map((department) => ({
          label: department,
          value: department,
        }))
      : [];

    const finalOptions = [
      {
        label: "Choose department",
        value: null,
      },
    ].concat(options);
    return finalOptions;
  };

  const isPersonFormValid = (person) =>
    Boolean(
      person.firstname?.trim() &&
        person.lastname?.trim() &&
        person.phonenumber?.trim() &&
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

  return (
    <div className="min-h-screen flex flex-col md:items-center bg-gray-50 p-4">
      <div className="lg:w-5/12">
        {/* Header with Logo and Title */}
        <header className="text-center mb-4 mt-1">
          <img
            src="/logo.jpg"
            alt="Harvesters International Christian Center Logo"
            className="w-32 h-32 mx-auto"
          />
          {/* <h1 className="text-2xl font-bold mt-4">
            Harvesters International Christian Centre, Gbagada campus
          </h1> */}
          <h2 className="text-2xl font-bold text-gray-500 mt-4">{title}</h2>
        </header>
        <div className="bg-white shadow-lg rounded-xl p-6 mb-24 mt-12">
          {/* Search Input */}
          {!isEditing && (
            <input
              type="text"
              placeholder="Search by name or phone number"
              className="w-full mb-4 p-2 h-14 border rounded-lg"
              value={query}
              onChange={handleSearch}
            />
          )}

          {/* Search Results attendance*/}
          {!isCreating &&
          !isEditing &&
          searchValue &&
          filteredPeople?.length > 0 ? (
            <div>
              <ul className="space-y-2">
                {filteredPeople?.map((person, index) => (
                  <li
                    key={index}
                    className="p-4 border rounded-lg flex justify-between items-center"
                  >
                    <div className="flex flex-col">
                      <span>
                        {person.firstname} {person.lastname}
                      </span>
                      {person.workerrole && (
                        <span className="opacity-60">{person.workerrole}</span>
                      )}
                      {person.team ? (
                        <span className="opacity-50">
                          {person?.team} -{" "}
                          {person?.department && person?.department}
                        </span>
                      ) : (
                        <span>{person.team || person.department}</span>
                      )}
                    </div>
                    {person.ispresent ? (
                      <div className="flex space-x-4">
                        <button className="px-2 py-2 text-sm bg-green-500 text-white rounded-lg flex justify-between cursor-not-allowed">
                          <CheckBadgeIcon className="text-white size-5" />
                          <span className="ml-3">Present</span>
                        </button>
                        {/* <button
                          onClick={() => handleEdit(person)}
                          className="px-8 py-2 text-sm bg-blue-500 text-white cursor-pointer rounded-lg flex"
                        >
                          Open
                        </button> */}
                      </div>
                    ) : (
                      <div className="flex space-x-4">
                        {/* <button
                          onClick={() =>
                            mutateIsLoadingId === 0
                              ? handleMarkPresent(person)
                              : undefined
                          }
                          className="px-2 py-2 text-sm bg-blue-500 text-white rounded-lg cursor-pointer flex"
                        >
                          {mutateIsLoadingId === person.id
                            ? "Marking..."
                            : "Mark Present"}
                        </button> */}
                        <button
                          onClick={() => handleEdit(person)}
                          className="px-8 py-2 text-sm bg-blue-500 text-white cursor-pointer rounded-lg flex"
                        >
                          Open
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <div className="items-center text-center">
                <div className="mt-6">OR</div>
                <button
                  onClick={handleCreate}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Manually add attendance
                </button>
              </div>
            </div>
          ) : (
            <>
              {!isCreating && !isEditing && (
                <div className="text-center my-4">
                  {isLoading && searchValue ? (
                    <p>Searching...</p>
                  ) : !isLoading && searchValue ? (
                    <div>
                      <p>No results</p>
                      <button
                        onClick={handleCreate}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                      >
                        Manually add attendance
                      </button>
                    </div>
                  ) : null}
                </div>
              )}
            </>
          )}

          {/* Create Form */}
          {isCreating && (
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-4 text-center">
                Manually add attendance
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full p-2 border rounded-lg"
                  value={newPerson.firstname}
                  onChange={(e) =>
                    setNewPerson({
                      ...newPerson,
                      firstname: capitalize(e.target.value),
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full p-2 border rounded-lg"
                  value={newPerson.lastname}
                  onChange={(e) =>
                    setNewPerson({
                      ...newPerson,
                      lastname: capitalize(e.target.value),
                    })
                  }
                />
                {/* <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 border rounded-lg"
                  value={newPerson.email}
                  onChange={(e) =>
                    setNewPerson({
                      ...newPerson,
                      email: e.target.value,
                    })
                  }
                /> */}
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="w-full p-2 border rounded-lg"
                  value={newPerson.phonenumber}
                  onChange={(e) =>
                    setNewPerson({ ...newPerson, phonenumber: e.target.value })
                  }
                />
                {/* <Select
                  label="Select team"
                  options={teams}
                  value={newPerson.team}
                  onChange={(value) =>
                    setNewPerson({
                      ...newPerson,
                      team: capitalize(value),
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Department eg Career and Finance"
                  className="w-full p-2 border rounded-lg"
                  value={newPerson.department}
                  onChange={(e) =>
                    setNewPerson({
                      ...newPerson,
                      department: capitalize(e.target.value),
                    })
                  }
                /> */}
                <div>
                  <Select
                    options={teamsSummary}
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
                    key={`create-dept-${activeTeam || ""}`}
                    options={getDepartment() || []}
                    onChange={(value) =>
                      setNewPerson({
                        ...newPerson,
                        department: value || "",
                      })
                    }
                    className="mb-3"
                  />
                </div>
                <div>
                  <Select
                    options={[
                      { label: "Choose role", value: "" },
                      ...workerrolesoptions.filter(option => option.value !== "All")
                    ]}
                    value={newPerson.workerrole}
                    onChange={(value) =>
                      setNewPerson({
                        ...newPerson,
                        workerrole: value,
                      })
                    }
                    className="mb-3"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={resetCreate}
                    className="w-full py-2 bg-red-500 text-white rounded-lg"
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
                    className={`w-full py-2 text-white rounded-lg ${
                      !isCreateFormValid || manuallySaving
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 cursor-pointer"
                    }`}
                  >
                    {manuallySaving ? "Saving" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Edit Form */}
          {isEditing && (
            <div className="mt-1">
              <h2 className="text-xl font-bold mb-4 text-center">
                Update worker info
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full p-2 border rounded-lg"
                  value={activePerson.firstname}
                  onChange={(e) =>
                    setActivePerson({
                      ...activePerson,
                      firstname: capitalize(e.target.value),
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full p-2 border rounded-lg"
                  value={activePerson.lastname}
                  onChange={(e) =>
                    setActivePerson({
                      ...activePerson,
                      lastname: capitalize(e.target.value),
                    })
                  }
                />
                {/* <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 border rounded-lg"
                  value={activePerson.email}
                  onChange={(e) =>
                    setActivePerson({
                      ...activePerson,
                      email: e.target.value,
                    })
                  }
                /> */}
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="w-full p-2 border rounded-lg"
                  value={activePerson.phonenumber}
                  onChange={(e) =>
                    setActivePerson({
                      ...activePerson,
                      phonenumber: e.target.value,
                    })
                  }
                />
                {/* <Select
                  label="Select team"
                  options={teams}
                  value={activePerson.team}
                  onChange={(value) =>
                    setActivePerson({
                      ...activePerson,
                      team: capitalize(value),
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Department eg Career and Finance"
                  className="w-full p-2 border rounded-lg"
                  value={activePerson.department}
                  onChange={(e) =>
                    setActivePerson({
                      ...activePerson,
                      department: capitalize(e.target.value),
                    })
                  }
                /> */}
                <div>
                  <Select
                    options={teamsSummary}
                    defaultValue={activePerson.team}
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
                    key={`edit-dept-${activeTeam || activePerson.team || ""}`}
                    options={getDepartment() || []}
                    defaultValue={activePerson.department}
                    onChange={(value) =>
                      setActivePerson({
                        ...activePerson,
                        department: value || "",
                      })
                    }
                    className="mb-3"
                  />
                </div>
                <div>
                  <Select
                    options={[
                      { label: "Choose role", value: "" },
                      ...workerrolesoptions.filter(option => option.value !== "All")
                    ]}
                    value={activePerson.workerrole}
                    onChange={(value) =>
                      setActivePerson({
                        ...activePerson,
                        workerrole: value,
                      })
                    }
                    className="mb-3"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={resetEdit}
                    className="w-full py-2 bg-red-500 text-white rounded-lg cursor-pointer"
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
                    className={`w-full py-2 text-white rounded-lg ${
                      !isEditFormValid || isEditSaving
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 cursor-pointer"
                    }`}
                  >
                    {isEditSaving ? "Marking..." : "Mark Attendance"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
