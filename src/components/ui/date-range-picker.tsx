"use client";

import React, { useEffect, useState } from "react";
import { addDays, format, isAfter, isBefore, isEqual, isSameDay, isWithinInterval, subDays } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { DateRange, DayPicker, SelectRangeEventHandler } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";

interface DateRangePickerProps {
  onUpdate?: (values: { range: DateRange; rangeCompare?: DateRange }) => void;
  initialDateFrom?: Date | string;
  initialDateTo?: Date | string;
  initialCompareFrom?: Date | string;
  initialCompareTo?: Date | string;
  align?: "start" | "center" | "end";
  locale?: string;
  showCompare?: boolean;
}

const formatDate = (date: Date, locale: string = "en-US"): string => {
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
  if (typeof dateInput === "string") {
    // Split the date string to get year, month, and day parts
    const parts = dateInput.split("-").map((part) => parseInt(part, 10));
    // Create a new Date object using the local timezone
    // Note: Month is 0-indexed in JavaScript Date constructor
    return new Date(parts[0], parts[1] - 1, parts[2]);
  } else {
    // If it's already a Date object, return as is
    return dateInput;
  }
};

interface Preset {
  name: string;
  label: string;
}

// Define presets
const PRESETS: Preset[] = [
  { name: "today", label: "Today" },
  { name: "yesterday", label: "Yesterday" },
  { name: "last7", label: "Last 7 days" },
  { name: "last14", label: "Last 14 days" },
  { name: "last30", label: "Last 30 days" },
  { name: "thisWeek", label: "This Week" },
  { name: "lastWeek", label: "Last Week" },
  { name: "thisMonth", label: "This Month" },
  { name: "lastMonth", label: "Last Month" },
];

export default function DateRangePicker({
  onUpdate,
  initialDateFrom = new Date(),
  initialDateTo,
  initialCompareFrom,
  initialCompareTo,
  align = "end",
  locale = "en-US",
  showCompare = true,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [range, setRange] = useState<DateRange>({
    from: getDateAdjustedForTimezone(initialDateFrom),
    to: initialDateTo ? getDateAdjustedForTimezone(initialDateTo) : getDateAdjustedForTimezone(initialDateFrom),
  });

  const [rangeCompare, setRangeCompare] = useState<DateRange | undefined>(
    initialCompareFrom
      ? {
          from: getDateAdjustedForTimezone(initialCompareFrom),
          to: initialCompareTo
            ? getDateAdjustedForTimezone(initialCompareTo)
            : getDateAdjustedForTimezone(initialCompareFrom),
        }
      : undefined
  );

  // Tracking input values and validation state
  const [openedRangeType, setOpenedRangeType] = useState<"range" | "compare" | undefined>(undefined);
  const [selectingType, setSelectingType] = useState<"range" | "compare" | undefined>("range");

  const [isSmallScreen, setIsSmallScreen] = useState(typeof window !== "undefined" ? window.innerWidth < 960 : false);

  useEffect(() => {
    const handleResize = (): void => {
      setIsSmallScreen(window.innerWidth < 960);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getPresetRange = (presetName: string): DateRange => {
    const preset = PRESETS.find((p) => p.name === presetName);
    if (!preset) throw new Error(`Unknown date range preset: ${presetName}`);
    const from = new Date();
    const to = new Date();
    const today = new Date();

    switch (preset.name) {
      case "today":
        return { from: today, to: today };
      case "yesterday":
        const yesterday = subDays(today, 1);
        return { from: yesterday, to: yesterday };
      case "last7":
        return { from: subDays(today, 6), to: today };
      case "last14":
        return { from: subDays(today, 13), to: today };
      case "last30":
        return { from: subDays(today, 29), to: today };
      case "thisWeek": {
        const startOfWeek = new Date(today);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        startOfWeek.setDate(diff);
        return { from: startOfWeek, to: today };
      }
      case "lastWeek": {
        const startOfLastWeek = new Date(today);
        const day = startOfLastWeek.getDay();
        const diff = startOfLastWeek.getDate() - day + (day === 0 ? -6 : 1) - 7; // adjust when day is sunday
        startOfLastWeek.setDate(diff);
        const endOfLastWeek = addDays(startOfLastWeek, 6);
        return { from: startOfLastWeek, to: endOfLastWeek };
      }
      case "thisMonth": {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return { from: startOfMonth, to: today };
      }
      case "lastMonth": {
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        return { from: startOfLastMonth, to: endOfLastMonth };
      }
      default:
        throw new Error(`Unknown date range preset: ${preset.name}`);
    }
  };

  const setPreset = (preset: string): void => {
    const range = getPresetRange(preset);
    setRange(range);
    if (rangeCompare) {
      const rangeCompare = {
        from: range.from && range.to ? subDays(range.from, differenceInDays(range.to, range.from) + 1) : undefined,
        to: range.from ? subDays(range.from, 1) : undefined,
      };
      setRangeCompare(rangeCompare);
    }
  };

  const checkPreset = (): string | undefined => {
    for (const preset of PRESETS) {
      const presetRange = getPresetRange(preset.name);

      const normalizedRangeFrom = new Date(range.from?.setHours(0, 0, 0, 0) ?? 0);
      const normalizedPresetFrom = new Date(presetRange.from?.setHours(0, 0, 0, 0) ?? 0);

      const normalizedRangeTo = new Date(range.to?.setHours(0, 0, 0, 0) ?? 0);
      const normalizedPresetTo = new Date(presetRange.to?.setHours(0, 0, 0, 0) ?? 0);

      if (isEqual(normalizedRangeFrom, normalizedPresetFrom) && isEqual(normalizedRangeTo, normalizedPresetTo)) {
        return preset.name;
      }
    }

    return undefined;
  };

  const resetValues = (): void => {
    setRange({
      from: getDateAdjustedForTimezone(initialDateFrom),
      to: initialDateTo ? getDateAdjustedForTimezone(initialDateTo) : getDateAdjustedForTimezone(initialDateFrom),
    });
    setRangeCompare(
      initialCompareFrom
        ? {
            from: getDateAdjustedForTimezone(initialCompareFrom),
            to: initialCompareTo
              ? getDateAdjustedForTimezone(initialCompareTo)
              : getDateAdjustedForTimezone(initialCompareFrom),
          }
        : undefined
    );
  };

  useEffect(() => {
    if (isOpen) {
      setOpenedRangeType("range");
      setSelectingType("range");
    }
  }, [isOpen]);

  const differenceInDays = (a: Date, b: Date): number => {
    return Math.ceil((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
  };

  const onRangeSelect: SelectRangeEventHandler = (range: DateRange | undefined) => {
    if (!range) return;

    if (selectingType === "range") {
      setRange(range);
      if (rangeCompare && range.from && range.to) {
        const rangeCompare = {
          from: subDays(range.from, differenceInDays(range.to, range.from) + 1),
          to: subDays(range.from, 1),
        };
        setRangeCompare(rangeCompare);
      }
    } else if (selectingType === "compare") {
      setRangeCompare(range);
    }
  };

  useEffect(() => {
    if (onUpdate) {
      onUpdate({ range, rangeCompare });
    }
  }, [range, rangeCompare]);

  const displayRange = (): string => {
    const { from, to } = range;
    if (!from) {
      return "Pick a date";
    } else if (to && !isSameDay(from, to)) {
      return `${formatDate(from, locale)} - ${formatDate(to, locale)}`;
    } else {
      return formatDate(from, locale);
    }
  };

  const displayCompare = (): string => {
    const { from, to } = rangeCompare || {};
    if (!from) {
      return "Pick a date";
    } else if (to && !isSameDay(from, to)) {
      return `${formatDate(from, locale)} - ${formatDate(to, locale)}`;
    } else {
      return formatDate(from, locale);
    }
  };

  return (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          resetValues();
        }
        setIsOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !range && "text-muted-foreground")}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700" align={align}>
        <div className="flex bg-white dark:bg-gray-900">
          <div className="flex flex-col">
            <div className="flex flex-col lg:flex-row">
              <div className="flex flex-col items-stretch border-r border-gray-200 dark:border-gray-700">
                <div className="flex flex-col gap-1 px-3 py-4 lg:pr-3 lg:pl-3 min-w-[140px]">
                  {PRESETS.map((preset) => (
                    <Button
                      key={preset.name}
                      onClick={() => setPreset(preset.name)}
                      variant="ghost"
                      className={cn(
                        "justify-start text-left h-8 px-2 text-sm font-normal hover:bg-gray-100 dark:hover:bg-gray-800", 
                        checkPreset() === preset.name && "bg-gray-100 dark:bg-gray-800 font-medium"
                      )}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-col gap-2 p-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="date-range" className="text-xs">
                      DATE RANGE
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="date-range"
                        className={cn("w-full", openedRangeType === "range" && "border-ring")}
                        value={displayRange()}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value;
                          console.log("Date range input changed:", value);
                        }}
                        onFocus={() => {
                          setOpenedRangeType("range");
                          setSelectingType("range");
                        }}
                      />
                    </div>
                  </div>
                  {showCompare && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="compare-mode"
                          checked={!!rangeCompare}
                          onCheckedChange={(checked: boolean) => {
                            if (checked) {
                              if (!range.from || !range.to) {
                                return;
                              }
                              const rangeCompare = {
                                from: subDays(range.from, differenceInDays(range.to, range.from) + 1),
                                to: subDays(range.from, 1),
                              };
                              setRangeCompare(rangeCompare);
                            } else {
                              setRangeCompare(undefined);
                            }
                          }}
                        />
                        <Label htmlFor="compare-mode" className="text-xs">
                          COMPARE
                        </Label>
                      </div>
                      {rangeCompare && (
                        <div className="flex gap-2">
                          <Input
                            className={cn("w-full", openedRangeType === "compare" && "border-ring")}
                            value={displayCompare()}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const value = e.target.value;
                              console.log("Compare range input changed:", value);
                            }}
                            onFocus={() => {
                              setOpenedRangeType("compare");
                              setSelectingType("compare");
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <DayPicker
                  mode="range"
                  selected={selectingType === "range" ? range : rangeCompare}
                  onSelect={onRangeSelect}
                  numberOfMonths={isSmallScreen ? 1 : 2}
                  className="border-t p-3"
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                    month: "space-y-4 w-full flex flex-col",
                    caption: "flex justify-center pt-1 relative items-center mb-4",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex mb-2",
                    head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center",
                    row: "flex w-full mt-2",
                    cell: "text-center text-sm relative p-0 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                  showOutsideDays={true}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 py-3 px-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <Button
                onClick={() => {
                  setIsOpen(false);
                  resetValues();
                }}
                variant="ghost"
                className="hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsOpen(false);
                  if (onUpdate) {
                    onUpdate({
                      range,
                      rangeCompare,
                    });
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
