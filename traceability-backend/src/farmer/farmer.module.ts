import Module from "module";

import { FarmerService } from './farmer.service';
@Module({
    providers: [FarmerService],
    exports: [FarmerService],   // <-- สำคัญมาก ต้อง export
})
export class FarmerModule { }