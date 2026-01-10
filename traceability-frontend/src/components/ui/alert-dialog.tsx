"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

/* ================= ROOT ================= */

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

/* ================= OVERLAY ================= */

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className = "", ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={[
      "fixed inset-0 z-50 bg-black/80",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
      className,
    ].join(" ")}
    {...props}
  />
));
AlertDialogOverlay.displayName = "AlertDialogOverlay";

/* ================= CONTENT ================= */

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className = "", ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={[
        "fixed left-1/2 top-1/2 z-50 w-full max-w-lg",
        "-translate-x-1/2 -translate-y-1/2",
        "bg-background border shadow-lg p-6",
        "grid gap-4",
        "data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0",
        "sm:rounded-lg",
        className,
      ].join(" ")}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = "AlertDialogContent";

/* ================= LAYOUT ================= */

const AlertDialogHeader = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={[
      "flex flex-col space-y-2 text-center sm:text-left",
      className,
    ].join(" ")}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={[
      "flex flex-col-reverse gap-2",
      "sm:flex-row sm:justify-end",
      className,
    ].join(" ")}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

/* ================= TEXT ================= */

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className = "", ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={["text-lg font-semibold", className].join(" ")}
    {...props}
  />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className = "", ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={["text-sm text-muted-foreground", className].join(" ")}
    {...props}
  />
));
AlertDialogDescription.displayName = "AlertDialogDescription";

/* ================= ACTIONS ================= */

const baseButton =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const primaryButton =
  "bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2";

const outlineButton =
  "border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2";

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className = "", ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={[baseButton, primaryButton, className].join(" ")}
    {...props}
  />
));
AlertDialogAction.displayName = "AlertDialogAction";

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className = "", ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={[
      baseButton,
      outlineButton,
      "mt-2 sm:mt-0",
      className,
    ].join(" ")}
    {...props}
  />
));
AlertDialogCancel.displayName = "AlertDialogCancel";

/* ================= EXPORT ================= */

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
