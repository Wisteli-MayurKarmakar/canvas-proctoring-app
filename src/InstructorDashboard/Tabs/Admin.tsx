import React, { lazy, Suspense, useState } from "react";
import LazyLoading from "../../CommonUtilites/LazyLoadFallback";
// import Institutions from "../Components/Institutions";
// import Billing from "../Components/Billing";
// import Payments from "../Components/Payments";
// import Access from "../Components/Access";

const Admin: React.FC = (): JSX.Element => {
  const [subOptionSelected, setSubOptionSelected] =
    useState<string>("Payments");

  const subMenus: string[] = ["Institute", "Billing", "Access", "Payments"];
  const Institutions = lazy(() => import("../Components/Institutions"));
  const Billing = lazy(() => import("../Components/Billing"));
  const Payments = lazy(() => import("../Components/Payments"));
  const Access = lazy(() => import("../Components/Access"));

  const handleSubOptionSelection = (option: string) => {
    setSubOptionSelected(option);
  };

  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-4 mt-2">
      <div className="flex flex-row h-full items-center gap-8">
        {subMenus.map((item: string, index: number) => {
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleSubOptionSelection(item)}
              className={`inline-block px-6 py-2.5  font-medium text-xs leading-tight rounded-full shadow-md  ${
                subOptionSelected === item
                  ? "bg-blue-400 text-white"
                  : "bg-gray-300 text-black hover:bg-blue-400 hover:text-white"
              }  transition duration-150 ease-in-out`}
            >
              {item}
            </button>
          );
        })}
      </div>
      <Suspense fallback={<LazyLoading />}>
        {subOptionSelected === "Institute" && <Institutions />}
        {subOptionSelected === "Billing" && <Billing />}
        {subOptionSelected === "Payments" && <Payments />}
        {subOptionSelected === "Access" && <Access />}
      </Suspense>
    </div>
  );
};

export default Admin;
