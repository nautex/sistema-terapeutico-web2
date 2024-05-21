import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import personReducer from "./personSlice";
import personDirectionReducer from "./personDirectionSlice";
import personDocumentReducer from "./personDocumentSlice";
import personContactReducer from "./personContactSlice";
import personBondingReducer from "./personBondingSlice";
import memberSearchReducer from "./memberSearchSlice";
import ubigeoSearchReducer from "./ubigeoSearchSlice";
import directionSearchReducer from "./directionSearchSlice";
import personSearchReducer from "./personSearchSlice";
import memberReducer from "./memberSlice";
import memberAllergyReducer from "./memberAllergySlice";
import memberAuthorizedPersonReducer from "./memberAuthorizedPersonSlice";
import therapyReducer from "./therapySlice";
import therapyScheduleReducer from "./therapyScheduleSlice";
import therapyTherapistReducer from "./therapyTherapistSlice";
import therapyMemberReducer from "./therapyMemberSlice";
import therapySearchReducer from "./therapySearchSlice";
import feeSearchReducer from "./feeSearchSlice";

export const store = configureStore({
  reducer: {
    person: personReducer,
    personDirection: personDirectionReducer,
    personDocument: personDocumentReducer,
    personContact: personContactReducer,
    personBonding: personBondingReducer,
    user: userReducer,
    ubigeoSearch: ubigeoSearchReducer,
    directionSearch: directionSearchReducer,
    personSearch: personSearchReducer,
    memberSearch: memberSearchReducer,
    member: memberReducer,
    memberAllergy: memberAllergyReducer,
    memberAuthorizedPerson: memberAuthorizedPersonReducer,
    therapy: therapyReducer,
    therapySchedule: therapyScheduleReducer,
    therapyTherapist: therapyTherapistReducer,
    therapyMember: therapyMemberReducer,
    therapySearch: therapySearchReducer,
    feeSearch: feeSearchReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});
