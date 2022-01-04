import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { UserForm } from "./UserForm";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import type { User, StateProps } from "../types";

import styles from "./UserFormManager.module.scss";

interface UserFormManagerProps extends StateProps {
  title: string;
  name?: string;
  friends?: number[];
  cleanUpFieldsOnSave?: boolean;
  mainWindowFunction: (name: string, friends: number[]) => Promise<User>;
  newUserFunction: (name: string, friends: number[]) => Promise<User>;
}

export function UserFormManager(props: UserFormManagerProps) {
  const {
    title,
    friends = [],
    name = "",
    cleanUpFieldsOnSave = true,
    mainWindowFunction,
    newUserFunction,
  } = props;
  const topmostWindowRef = useRef<HTMLDivElement>(null);
  const [saveOrAbort, setSaveOrAbort] = useState(false);
  const [windows, setWindows] = useState<{ friends: number[] }[]>([
    { friends },
  ]);

  function handleSave(id: number) {
    console.log(`id of the user just saved: ${id}`);

    setSaveOrAbort(false);

    if (windows.length > 1) {
      const newWindows = [...windows.slice(0, windows.length - 1)];
      const lastWindow = newWindows[newWindows.length - 1];
      if (lastWindow) {
        lastWindow.friends = [...lastWindow.friends, id];
      }
      setWindows(newWindows);
    }
  }

  function openNewFriendWindow() {
    setWindows([...windows, { friends: [] }]);
  }

  function handleAbort() {
    setSaveOrAbort(false);
    setWindows([...windows.slice(0, windows.length - 1)]);
  }

  useOnClickOutside(topmostWindowRef, () => {
    setSaveOrAbort(true);
  });

  useEffect(() => {
    if (friends.length > 0) {
      setWindows((windows) => {
        const newWindow = { ...windows[0] };
        newWindow.friends = friends;
        return [newWindow, ...windows.slice(1)];
      });
    }
  }, [friends]);

  return (
    <div className={styles["windows-container"]}>
      {windows.map((window, i) => {
        const isWindowTopmost =
          windows.length === 1 || i === windows.length - 1;
        const isFirstWindow = i === 0;

        return (
          <div
            ref={
              isWindowTopmost && windows.length > 1 ? topmostWindowRef : null
            }
            className={classNames(styles.window, {
              [styles.disabled]: !isWindowTopmost,
            })}
            key={i}
            role="dialog"
          >
            <UserForm
              title={isFirstWindow ? title : "New User"}
              cleanUpFieldsOnSave={cleanUpFieldsOnSave}
              saveFunction={
                isFirstWindow ? mainWindowFunction : newUserFunction
              }
              name={isFirstWindow ? name : ""}
              friends={window.friends}
              disabled={!isWindowTopmost}
              onSave={handleSave}
              onAbort={handleAbort}
              openNewFriendWindow={openNewFriendWindow}
              saveOrAbort={isWindowTopmost && windows.length > 1 && saveOrAbort}
              state={props.state}
            />
          </div>
        );
      })}
    </div>
  );
}
