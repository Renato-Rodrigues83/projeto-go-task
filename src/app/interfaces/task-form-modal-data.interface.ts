import { ITaskFormControls } from "./task-form-controls.interface";

export interface ITaskFormModalData {
    mode: 'create' | 'edit';
    formValues: ITaskFormControls;
}