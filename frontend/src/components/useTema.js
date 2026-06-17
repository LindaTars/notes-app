import { useContext } from "react";
import { TemaContext } from "./TemaContext";

const useTema = () => {
    return useContext(TemaContext)
}

export default useTema