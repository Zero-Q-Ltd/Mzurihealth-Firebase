export interface Patientnotes {
  title: string;
  note: string;
  userid: string;
  id: string;
  timestamp: number;
  username: string;
}

export const emptynote: Patientnotes = {
  title: null,
  note: null,
  userid: null,
  id: null,
  timestamp: null,
  username: null,
};
