import React from "react";
import { Cell, Column, Row, Table, TableBody, TableHeader } from "./table";
import { useAsyncList } from "@react-stately/data";
import { Provider, defaultTheme, ActionButton } from "@adobe/react-spectrum";

function AsyncLoadingExample() {
  interface Item {
    data: {
      id: string;
      url: string;
      title: string;
    };
  }

  let list = useAsyncList<Item>({
    getKey: (item) => item.data.id,
    async load({ signal, cursor }) {
      let url = new URL("https://www.reddit.com/r/news.json");
      if (cursor) {
        url.searchParams.append("after", cursor);
      }

      let res = await fetch(url.toString(), { signal });
      let json = await res.json();
      return { items: json.data.children, cursor: json.data.after };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.slice().sort((a, b) => {
          let cmp =
            a.data[sortDescriptor.column] < b.data[sortDescriptor.column]
              ? -1
              : 1;
          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }
          return cmp;
        }),
      };
    },
  });

  return (
    <div>
      <ActionButton
        marginBottom={10}
        onPress={() => list.remove(list.items[0].data.id)}
      >
        Remove first item
      </ActionButton>
      <Table
        aria-label="Top news from Reddit"
        selectionMode="multiple"
        width={1000}
        height={400}
        isQuiet
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
      >
        <TableHeader>
          <Column key="score" width={100} allowsSorting>
            Score
          </Column>
          <Column key="title" isRowHeader allowsSorting>
            Title
          </Column>
          <Column key="author" width={200} allowsSorting>
            Author
          </Column>
          <Column key="num_comments" width={100} allowsSorting>
            Comments
          </Column>
        </TableHeader>
        <TableBody
          items={list.items}
          isLoading={list.isLoading}
          onLoadMore={list.loadMore}
        >
          {(item) => (
            <Row key={item.data.id}>
              {(key) =>
                key === "title" ? (
                  <Cell textValue={item.data.title}>
                    <a href={item.data.url} target="_blank">
                      {item.data.title}
                    </a>
                  </Cell>
                ) : (
                  <Cell>{item.data[key]}</Cell>
                )
              }
            </Row>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function App() {
  return (
    <Provider theme={defaultTheme}>
      <AsyncLoadingExample />
    </Provider>
  );
}

export default App;
