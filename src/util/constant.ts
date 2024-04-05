interface StringObj {
  [key: string]: string;
}

const second: number = 1000;
const minute: number = second * 60;
const hour: number = minute * 60;
const day: number = hour * 24;
const month: number = day * 31;
const year: number = month * 12;

export const TIME_IN_MILLISECONDS: {
  [key: string]: number;
} = {
  second,
  minute,
  hour,
  day,
  month,
  year,
};

export const DEFAULT_PROFILE: string = "/images/profile-default.svg";

export const ERROR_MESSAGE: StringObj = {
  wrongInput: "내용을 다시 입력해주세요.",
};
