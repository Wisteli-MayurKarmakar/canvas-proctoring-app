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
  authQuizId?: any;
  mainTableActions: any;
  expandedRow: (row: any) => void;
  enableAuth: any;
  studentAuthStatus: boolean;
  loading?: boolean;
}

const Grid: React.FunctionComponent<Props> = (props): JSX.Element => {
  let selectedQuizId: any = null;
  let selectedQuizDate: any = null;
  let selectedQuizTitle: any = null;
  const [activeRow, setActiveRow] = React.useState<any>([]);
  const addActions = (quizId: string) => {
    if (props.childTableActions) {
      props.nestedTableColumns.forEach((col: any, index: number) => {
        if (col.key === "action") {
          col.render = (row: any) => {
            return (
              <div className="flex flex-row h-full items-center gap-4">
                <Button
                  type="link"
                  key={index}
                  disabled={
                    props.authQuizId &&
                    parseInt(props.authQuizId) === selectedQuizId &&
                    props.enableAuth &&
                    props.enableAuth.step === "LIVE_AUTH" &&
                    props.enableAuth.studId === row.id &&
                    props.studentAuthStatus === false
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
                  {props.studentAuthStatus === false
                    ? "Authenticate"
                    : "Authenticated"}
                </Button>
                <Button type="link" disabled={true}>
                  Contacts
                </Button>
              </div>
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
        loading={props.loading}
        columns={props.mainTableColumns}
        pagination={props.pagination ? { position: ["bottomLeft"] } : false}
        expandable={{
          expandedRowRender: (rowData: any) => {
            selectedQuizId = rowData.id;
            if ("due_at" in rowData) {
              selectedQuizDate = rowData.due_at;
            }
            selectedQuizTitle = rowData.name;
            if (props.nestedTableData) {
              addActions(selectedQuizId as string);
              return (
                <div key={rowData.id}>
                  <p
                    key={rowData.id + "a"}
                    className="text-center text-base font-bold underline"
                  >
                    {rowData.name} enrollments
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
                </div>
              );
            } else {
              return (
                <p className="font-bold" key={rowData.id}>
                  Getting enrollments...
                </p>
              );
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
      loading={props.loading}
      columns={props.mainTableColumns}
      pagination={props.pagination ? { position: ["bottomLeft"] } : false}
    />
  );
};

export default Grid;
