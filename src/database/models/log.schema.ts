import {Document, Model, model, Schema} from 'mongoose';

import {ILog} from '../../models';
import {TableNamesEnum} from '../../constants';

export type LogType = ILog & Document;

export const LogSchema: Schema = new Schema<ILog>({
  event: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  data: Schema.Types.Mixed
},{
  timestamps: true
}
);

export const LogModel: Model<any> = model<LogType>(TableNamesEnum.LOG, LogSchema);
