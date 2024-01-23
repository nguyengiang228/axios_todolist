import { useEffect, useState } from "react";
import {
  IUser,
  IUserData,
  IUserEditForm,
  IUserParam,
} from "../../interfaces/user";
import { customApi } from "../../request/request";

const User = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [editForm, setEditForm] = useState<IUserEditForm>({
    id: 0,
    isEdit: false,
  });
  const [inputValue, setInputValue] = useState<IUserData>({
    name: "",
    email: "",
  });

  const params = {};

  const handlePostValue = () => {
    const postApi = async () => {
      try {
        const res = await customApi.post<IUser, IUserData>(
          "/users/",
          inputValue
        );
        setUsers([...users, res.data]);

        // check reset input

        if (res.status < 200 || res.status > 400) {
          console.log("Có lỗi xảy ra: ", res.status);
        } else {
          setInputValue({ name: "", email: "" });
        }
      } catch (err) {
        console.log(err);
      }
    };
    postApi();
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({ ...inputValue, name: e.target.value });
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue({ ...inputValue, email: e.target.value });
  };

  const handleDelete = (id: number) => {
    const deleteApi = async () => {
      try {
        await customApi.delete<IUser>(`/users/${id}`);
        const deleteId = users.filter((res) => res.id !== id);
        const conf = window.confirm("Do you want to delete?");
        if (conf) {
          setUsers(deleteId);
        }
        // console.log("Delete success!", deleteId);
      } catch (err) {
        console.log(err);
      }
    };
    deleteApi();
  };

  const handleEditUser = () => {
    const editApi = async () => {
      try {
        await customApi.put<IUser[], IUserData>(`/users/${editForm.id}`, {
          name: inputValue.name,
          email: inputValue.email,
        });
        const editUser = users.map((user) => {
          if (user.id === editForm.id) {
            return {
              id: user.id,
              name: inputValue.name,
              email: inputValue.email,
            };
          }
          return user;
        });

        setUsers(editUser);
        setEditForm({
          id: 0,
          isEdit: false,
        });
        setInputValue({ name: "", email: " " });
      } catch (err) {
        console.log(err);
      }
    };
    editApi();
  };

  const handleCancel = () => {
    setEditForm({
      id: 0,
      isEdit: false,
    });
    setInputValue({ name: "", email: "" });
  };

  const handleCheckIsEditForm = (id: number) => {
    setEditForm({
      id,
      isEdit: true,
    });
    const findUser = users.find((user) => user.id === id);
    if (findUser) {
      const newData = {
        name: findUser.name,
        email: findUser.email,
      };

      setInputValue(newData);
    }
  };

  useEffect(() => {
    const exportOrderManagementFile = async () => {
      try {
        const { data } = await customApi.get<IUser[], IUserParam>(
          "/users",
          params
        );
        setUsers(data);
      } catch (err) {
        console.log("Error:", err);
      }
    };
    exportOrderManagementFile();
  }, []);

  return (
    <>
      <div>
        <label>Name: </label>
        <input
          type="text"
          name="name"
          value={inputValue.name}
          onChange={handleChangeName}
        />
      </div>
      <div>
        <label>Email: </label>
        <input
          type="email"
          name="email"
          value={inputValue.email}
          onChange={handleChangeEmail}
        />
      </div>

      {!editForm.isEdit ? (
        <>
          <button onClick={handlePostValue}>Create</button>

          {users.length > 0 &&
            users.map((user, index) => (
              <div key={index}>
                <tr>
                  <td>{user.id}</td>
                  &emsp;
                  <td>{user.name}</td>&emsp;
                  <td>{user.email}</td>
                  &emsp;
                  <button onClick={() => handleDelete(user.id)}>DELETE</button>
                  <button onClick={() => handleCheckIsEditForm(user.id)}>
                    EDIT
                  </button>
                </tr>
              </div>
            ))}
        </>
      ) : (
        <>
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleEditUser}>SAVE</button>
        </>
      )}
    </>
  );
};

export default User;
