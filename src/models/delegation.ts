import { Schema, model, Document, models } from 'mongoose';
const delegationSchema = new Schema({
    organizationName: { type: String, required: true },
    headDelegateName: { type: String, required: true },
    emailId: { type: String, required: true },
    contactNumber: { type: String, required: true },
    delegationStrength: { type: String, required: true },
}, {
    timestamps: true
});
const Delegation = models.Delegation || model('Delegation', delegationSchema, 'delegation');
export default Delegation;