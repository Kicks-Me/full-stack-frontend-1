import { useRoutes } from "react-router-dom"
import { route } from "./route/route"

const StartUp = () => {
    const routes = useRoutes(route);

  return routes;
}

export default StartUp