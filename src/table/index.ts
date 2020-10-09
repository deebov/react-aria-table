import { Column } from "@react-stately/table";
import { SpectrumColumnProps } from "@react-types/table";
export { Table } from "./Table";

// Override TS for Column to support spectrum specific props.
const SpectrumColumn = Column as <T>(
  props: SpectrumColumnProps<T>
) => JSX.Element;
export { SpectrumColumn as Column };

export {
  TableHeader,
  TableBody,
  Section,
  Row,
  Cell,
} from "@react-stately/table";
