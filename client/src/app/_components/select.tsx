"use client"

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SelectOptionProps {
  value: string;
  active: boolean;
  updateValue: (value: string) => void;
  className?: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  name?: string;
  value?: string;
  options: string[];
  updateValue: (value: string) => void;
  className?: string;
  icon?: React.ReactNode;
  titleChange?: boolean;
  textColor?: string;
}

const SelectOption: React.FC<SelectOptionProps> = ({
  value = "",
  active = false,
  updateValue,
  icon,
  className = "",
}) => {
  const handleChange = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.preventDefault();
    updateValue(value);
  };

  return (
    <li
      className={`
z-10 cursor-default pt-4
hover:bg-[#0a1d35] hover:text-white select-none relative py-2 pl-3 pr-9 'text-gray-900'} ${className}
`}
      onClick={handleChange}
    >
      <div className="flex items-center">
        <span className="ml-3 block font-normal truncate text-[12px]">{value}</span>
      </div>
      {active && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-4">
          {icon}
        </span>
      )}
    </li>
  );
};

const Select: React.FC<SelectProps> = ({
  name = "customSelect",
  value = "-- Select Option --",
  options = [],
  updateValue,
  className = "",
  icon,
  textColor = "text-black",
}) => {
  const [state, setState] = useState({
    value,
    showOptions: false,
    buttonText: value,
  });

  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setState((prevState) => ({ ...prevState, showOptions: !prevState.showOptions }));
  };

  const handleChange = (value: string) => {
    setState((prevState) => ({
      ...prevState,
      showOptions: false,
      value,
      buttonText: prevState.buttonText,
    }));
    updateValue(value);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setState((prevState) => ({ ...prevState, showOptions: false }));
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!icon) {
    icon = (
      <svg
        className="h-6 w-6 mt-1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.29289 7.29289C5.68342 6.90237 6.31658 6.90237 6.70711 7.29289L10 10.5858L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L10.7071 12.7071C10.3166 13.0976 9.68342 13.0976 9.29289 12.7071L5.29289 8.70711C4.90237 8.31658 4.90237 7.68342 5.29289 7.29289Z"
          clipRule="evenodd"
        ></path>
      </svg>
    );
  }

  return (
    <div ref={ref} className="mt-1 relative z-20">
      <input type="hidden" name={name} value={state.value} />
      <button
        type="button"
        className={cn(
          "relative w-full rounded-md pl-3 pr-10 py-3 text-left cursor-default",
          state.showOptions ? "outline-none" : "",
          className,
          textColor
        )}
        onClick={handleClick}
      >
        <span className="flex items-center">
          <span className="ml-3 block truncate">{state.buttonText}</span>
        </span>
        <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          {icon}
        </span>
      </button>
      {state.showOptions && (
        <div className="absolute mt-1 w-full z-30 rounded-md shadow-lg text-white bg-[#0a1d35]">
          <ul
            className={`
max-h-56 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto
focus:outline-none ${className}
`}
            style={{ width: '100%' }} // Ensure the options dropdown matches the button width
          >
            {options.map((option, idx) => (
              <SelectOption
                key={idx}
                value={option}
                active={state.value === option}
                updateValue={handleChange}
                className={className}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
