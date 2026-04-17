import React, { forwardRef, useId } from "react";
import clsx from "clsx";

const Select = forwardRef(
  (
    {
      onChange = () => {},
      value,
      className,
      inputClassName,
      label,
      secondaryLabel,
      hasErrors = false,
      error,
      disabled,
      readOnly,
      options,
      showBorder = true,
      id,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className={clsx(className)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm mb-2 block text-gray-700"
          >
            {label}
          </label>
        )}
        {secondaryLabel && (
          <label
            htmlFor={selectId}
            className="text-xs mb-2 block text-gray-700"
          >
            {secondaryLabel}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={clsx(
            { "border border-gray-300": showBorder },
            { "border-red-500": hasErrors },
            inputClassName,
            { "!bg-gray-50 cursor-not-allowed": disabled },
            "inline-block w-full py-2 px-4 rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none h-max min-h-[44px]"
          )}
          disabled={disabled || readOnly}
          aria-invalid={hasErrors || undefined}
          aria-label={!label ? rest["aria-label"] : undefined}
          {...rest}
        >
          {options.map((option) => (
            <option
              className="whitespace-break-spaces text-wrap w-16 truncate"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
