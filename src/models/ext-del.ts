import { Schema, model, models } from 'mongoose';
const CommitteePreferenceSchema = new Schema({
    preference_1: { type: String, default: null },
    preference_2: { type: String, default: null },
    preference_3: { type: String, default: null },
}, { _id: false });
const ExperienceEntrySchema = new Schema({
    muns: { type: Number, default: 0 },
    experience: { type: String, default: "" },
}, { _id: false });
const ExperienceSchema = new Schema({
    delegate: { type: ExperienceEntrySchema, default: () => ({}) },
    eb: { type: ExperienceEntrySchema, default: () => ({}) },
}, { _id: false });
const externalDelegateSchema = new Schema({
    participant_name: { type: String, required: true },
    email_id: { type: String, required: true },
    contact_number: { type: String, required: true },
    allotment_committee: { type: String, default: null },
    allotment_portfolio: { type: String, default: null },
    paid: { type: Boolean, default: false },
    lunch: { type: Boolean, default: false },
    gender: { type: String, default: null },
    organisation_name: { type: String, default: null },
    accommodation: { type: String, default: null },
    committee_preferences: { type: CommitteePreferenceSchema, default: null },
    experience: { type: ExperienceSchema, default: null },
}, {
    timestamps: true
});
const ExternalDelegate = models.ExternalDelegate || model('ExternalDelegate', externalDelegateSchema, 'external');
export default ExternalDelegate;