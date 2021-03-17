const getUnix = () => Math.round(new Date().getTime() / 1000);

// This is a nightmare
const unixToDate = (date: number) => {
  const all = new Date(date * 1000);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const mins =
    all.getMinutes() < 10 ? `0${all.getMinutes()}` : all.getMinutes();
  const secs =
    all.getSeconds() < 10 ? `0${all.getSeconds()}` : all.getSeconds();
  const hours = ((all.getHours() + 11) % 12) + 1;
  return (
    months[all.getMonth()] +
    " " +
    all.getDate() +
    " " +
    all.getFullYear() +
    " " +
    hours +
    ":" +
    mins +
    ":" +
    secs +
    (all.getHours() <= 12 ? " AM" : " PM")
  );
};

export { getUnix };
export { unixToDate };
