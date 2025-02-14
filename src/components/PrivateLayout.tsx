import { RootStore } from "@/redux/Store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import axios from "axios";
import { SetCurrentUser } from "@/redux/UsersSlice";
import { SetLoading } from "@/redux/LoadersSlice";
import { Badge, Popover, message } from "antd";
import { useRouter } from "next/navigation";
import { getCatchErrorMessage } from "@/helpers/ErrorMessgaes";
import { RiCarLine } from "react-icons/ri";

function PrivateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { loading } = useSelector((state: RootStore) => state.loaders);
  const { currentUser } = useSelector((state: RootStore) => state.users);
  const { items } = useSelector((state: RootStore) => state.cart);
  const dispatch = useDispatch();

  const getCurrentUser = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await axios.get("/api/auth/current_user");
      dispatch(SetCurrentUser(response.data.data));
    } catch (error: unknown) {
      router.push("/login");
      message.error(getCatchErrorMessage(error));
    } finally {
      dispatch(SetLoading(false));
    }
  };

  const onLogout = async () => {
    try {
      dispatch(SetLoading(true));
      await axios.get("/api/auth/logout");
      dispatch(SetCurrentUser(null));
      router.push("/login");
    } catch (error: unknown) {
      message.error(getCatchErrorMessage(error));
    } finally {
      dispatch(SetLoading(false));
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items]);

  const popoverContent = (
    <div className="flex flex-col gap-2 p-2">
      <div
        className="flex gap-2 items-center cursor-pointer"
        onClick={onLogout}
      >
        <i className="ri-logout-box-r-line"></i>
        <span>Logout</span>
      </div>
    </div>
  );

  return (
    currentUser && (
      <>
        {loading && <Loader />}
        <div className="header bg-gray-800 px-5 py-4 flex justify-between items-center">
          <h1
            className="text-2xl font-black cursor-pointer text-red-400"
            onClick={() => router.push("/")}
          >
            Car <span className="text-yellow-500 font-semibold">Rental</span>
          </h1>

          <div className="flex gap-5 items-center">
            <Badge count={items.length}>
              <RiCarLine
                className="text-white text-2xl cursor-pointer"
                onClick={() => router.push("/cart")}
              />
            </Badge>
            <Popover
              placement="bottomRight"
              content={popoverContent}
              trigger="click"
            >
              <div className="flex justify-center items-center bg-white rounded-full h-10 w-10 cursor-pointer">
                <span>{currentUser.name[0].toUpperCase()}</span>
              </div>
            </Popover>
          </div>
        </div>
        <div className="content px-5 py-3">{children}</div>
      </>
    )
  );
}

export default PrivateLayout;
