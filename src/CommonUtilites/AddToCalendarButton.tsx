import React, { useEffect } from "react";
import {
  google,
  office365,
  outlook,
  ics,
  yahoo,
  CalendarEvent,
} from "calendar-link";
import {
  CalendarOutlined,
  GoogleOutlined,
  YahooOutlined,
  AppleOutlined,
  WindowsOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { useAppStore } from "../store/AppSotre";

type EventProto = {
  [key: string]: any;
};

interface Props {
  assignment: EventProto;
  showChat: () => void;
}

const AddToCalendarButton: React.FC<Props> = (props): JSX.Element => {
  let [showCalendars, setShowCalendars] = React.useState<boolean>(false);
  const { urlParamsData } = useAppStore((state) => state);

  useEffect(() => {
    setShowCalendars(false);
  }, [props.assignment]);

  let calendars: { [key: string]: any }[] = [
    { name: "Google", icon: <GoogleOutlined /> },
    { name: "Office 365", icon: <WindowsOutlined /> },
    { name: "Outlook", icon: <WindowsOutlined /> },
    { name: "Yahoo", icon: <YahooOutlined /> },
    { name: "iCal", icon: <AppleOutlined /> },
  ];

  const handleAddCalendarClick = () => {
    setShowCalendars(!showCalendars);
  };

  const handleCalendarClick = (e: any, calendarName: string) => {
    let event: CalendarEvent = {
      title: `Take the quiz: ${props.assignment.name}`,
      start: props.assignment.due_at,
      duration: [3, "hour"],
    };
    let link: string = "";
    switch (calendarName) {
      case "Google":
        link = google(event);
        window.open(link, "_blank");
        break;
      case "Office 365":
        link = office365(event);
        window.open(link, "_blank");
        break;
      case "Outlook":
        link = outlook(event);
        window.open(link, "_blank");
        break;
      case "iCal":
        link = ics(event);
        window.open(link, "_blank");
        break;
      case "Yahoo":
        link = yahoo(event);
        window.open(link, "_blank");
        break;
      default:
        e.preventDefault();
    }
  };

  const showCalendar: boolean = urlParamsData.newTab;

  return (
    <div className="flex flex-row gap-4 items-center justify-center">
      {!showCalendar && (
        <CalendarOutlined style={{ fontSize: 20, fill: "grey" }} />
      )}
      {!showCalendar && (
        <p
          className="md:font-semibold cursor-pointer md:block text-xs md:text-base text-ellipsis break-all transition focus:outline-none"
          onClick={handleAddCalendarClick}
        >
          Add to Calendar: {props.assignment.name}
        </p>
      )}
      {showCalendars && !showCalendar ? (
        <svg
          className="w-4 h-4 cursor-pointer"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleAddCalendarClick}
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          ></path>
        </svg>
      ) : (
        !showCalendar && (
          <svg
            className="mr-2 w-4 h-4 cursor-pointer"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            onClick={handleAddCalendarClick}
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        )
      )}
      {showCalendars && !showCalendar && (
        <div className="flex flex-row gap-2 transition-all ease-in duration-150">
          {calendars.map((item: { [key: string]: any }, index: number) => {
            if (item.name === "iCal") {
              return (
                <div className="flex flex-row gap-1 items-center" key={index}>
                  {item.icon}
                  <p
                    className="text-base text-center font-semibold cursor-pointer hidden md:block"
                    key={item.name}
                    onClick={(e) => handleCalendarClick(e, item.name)}
                  >
                    {item.name}
                  </p>
                </div>
              );
            } else {
              return (
                <div
                  className="flex flex-row gap-1 items-center border-r-2 border-black pr-1 md:border-white"
                  key={index}
                >
                  {item.icon}
                  <p
                    onClick={(e) => handleCalendarClick(e, item.name)}
                    key={item.name}
                    className="text-base text-center font-semibold cursor-pointer border-r-2 border-black pr-1 hidden md:block"
                  >
                    {item.name}
                  </p>
                </div>
              );
            }
          })}
        </div>
      )}
      {urlParamsData.newTab && (
        <Tooltip placement="top" overlay="Chat">
          <WechatOutlined
            onClick={() => props.showChat()}
            className="text-4xl cursor-pointer absolute right-52"
            style={{ color: "#42c8f5" }}
          />
        </Tooltip>
      )}
    </div>
  );
};

export default AddToCalendarButton;
