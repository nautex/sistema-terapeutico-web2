import { useSelector, useDispatch } from "react-redux";
import { changeEmail } from "../redux/userSlice";
import { Button } from "@mui/material";

export function Email() {
  const email = useSelector((state) => state.user.email);
  const dispatch = useDispatch();

  return (
    <div>
        <input
        type="email"
        value={email}
        onChange={(event) => dispatch(changeEmail(event.target.value))}
        />
        <Button variant="outlined">Guardar</Button>
    </div>
  );
}
