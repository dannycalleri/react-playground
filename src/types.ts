export interface Action {
  type: string;
  payload: any;
}

export interface StateProps {
  state: {
    data: User[];
    dispatch: React.Dispatch<Action>;
  };
}

export interface User {
  name: string;
  id: number;
}
