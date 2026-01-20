import { useLocalStorage } from "@hooks";
export default function useSession() {
  const { removeItem, getItem } = useLocalStorage();
  const listenEvents = () => {
    localStorage.setItem("currentDate", new Date());
    document.addEventListener("mousemove", () => {
      localStorage.setItem("currentDate", new Date());
    });
    document.addEventListener("click", () => {
      localStorage.setItem("currentDate", new Date());
    });
    document.addEventListener("keydown", () => {
      localStorage.setItem("currentDate", new Date());
    });

    let timeInterval = setInterval(() => {
      let lastAcivity = localStorage.getItem("currentDate");
      var diffMs = Math.abs(new Date(lastAcivity) - new Date());
      var seconds = Math.floor(diffMs / 1000);
      var minute = Math.floor(seconds / 60);
      if (minute == 20 || !getItem("currentDate")) {
        removeItem("data");
        removeItem("currentDate");
        window.location = "/auth/login";

        clearInterval(timeInterval);
      }
    }, 1000);
  };

  return {
    listenEvents,
  };
}
