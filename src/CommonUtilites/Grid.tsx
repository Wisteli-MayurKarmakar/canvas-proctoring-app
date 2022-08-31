import { Button, Table } from "antd";
import React, { useEffect } from "react";

interface Props {
  data: any;
  pagination: boolean;
  nestedTable: boolean;
  nestedTableData: any;
  mainTableColumns: any;
  nestedTableColumns: any;
  childTableActions: any;
  mainTableActions: any;
  expandedRow: (row: any) => void;
  enableAuth: any;
}

const Grid: React.FunctionComponent<Props> = (props): JSX.Element => {
  let selectedQuizId: any = null;
  let selectedQuizDate: any = null;
  let selectedQuizTitle: any = null;
  const [activeRow, setActiveRow] = React.useState<any>([]);

  const addActions = (quizId: string) => {
    if (props.childTableActions) {
      props.nestedTableColumns.forEach((col: any) => {
        if (col.key === "action") {
          col.render = (row: any) => {
            return (
              <Button
                type="link"
                key={row.id}
                disabled={
                  props.enableAuth && props.enableAuth.step === "Authentication" &&
                  props.enableAuth.studId === row.user.id
                    ? false
                    : true
                }
                onClick={() =>
                  props.childTableActions["Authenticate"](
                    row,
                    selectedQuizTitle,
                    quizId
                  )
                }
              >
                Authenticate
              </Button>
            );
          };
        }
      });
    }
  };

  if (props.nestedTable) {
    return (
      <Table
        dataSource={props.data}
        columns={props.mainTableColumns}
        pagination={props.pagination ? { position: ["bottomLeft"] } : false}
        expandable={{
          expandedRowRender: (rowData: any) => {
            selectedQuizId = rowData.id;
            selectedQuizDate = rowData.all_dates.due_at;
            selectedQuizTitle = rowData.title;
            if (props.nestedTableData) {
              addActions(selectedQuizId as string);
              return (
                <>
                  <p className="text-center text-base font-bold underline">
                    {rowData.title} enrollments
                  </p>
                  <Table
                    columns={props.nestedTableColumns}
                    dataSource={props.nestedTableData}
                    pagination={
                      props.nestedTableData && props.nestedTableData.length > 10
                        ? { position: ["bottomRight"] }
                        : false
                    }
                  />
                </>
              );
            } else {
              return <p className="font-bold">Getting enrollments...</p>;
            }
          },
          expandedRowKeys: activeRow,
          rowExpandable: (record) => true,
          onExpand: (expanded: boolean, row: any) => {
            if (expanded) {
              props.expandedRow(row);
              let key = [];
              key.push(row.id);
              setActiveRow(key);
            } else {
              setActiveRow([]);
            }
          },
        }}
      />
    );
  }

  return (
    <Table
      dataSource={props.data}
      columns={props.mainTableColumns}
      pagination={props.pagination ? { position: ["bottomLeft"] } : false}
    />
  );
};

export default Grid;
