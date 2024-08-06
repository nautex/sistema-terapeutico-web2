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
import therapyPeriodSearchReducer from "./therapyPeriodSearchSlice";
import periodSearchReducer from "./periodSearchSlice";
import periodReducer from "./periodSlice";
import therapyPeriodOpenReducer from "./therapyPeriodOpenSlice";
import sessionTherapistSearchReducer from "./sessionTherapistSearchSlice";
import sessionReducer from "./sessionSlice";
import sessionTherapistReducer from "./sessionTherapistSlice";
import sessionSearchReducer from "./sessionSearchSlice";
import feeReducer from "./feeSlice";
import sessionCriterionReducer from "./sessionCriterionSlice";
import therapyPlanSearchReducer from "./therapyPlanSearchSlice";
import therapyPlanReducer from "./therapyPlanSlice";
import therapyPlanAreaReducer from "./therapyPlanAreaSlice";

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
    therapyPeriodSearch: therapyPeriodSearchReducer,
    periodSearch: periodSearchReducer,
    period: periodReducer,
    therapyPeriodOpen: therapyPeriodOpenReducer,
    sessionTherapistSearch: sessionTherapistSearchReducer,
    session: sessionReducer,
    sessionTherapist: sessionTherapistReducer,
    sessionSearch: sessionSearchReducer,
    fee: feeReducer,
    sessionCriterion: sessionCriterionReducer,
    therapyPlanSearch: therapyPlanSearchReducer,
    therapyPlan: therapyPlanReducer,
    therapyPlanArea: therapyPlanAreaReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});
