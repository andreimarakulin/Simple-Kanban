import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { Store, useStore } from "../store";
import { IBoard } from "../store/BoardStore";
import CreateBoard from "./modals/CreateBoardModal";
import { ReactComponent as DeleteIcon } from "../assets/delete.svg";

const BoardsList: FC = () => {
  const store: Store = useStore();
  const [createBoardVisible, setCreateBoardVisible] = useState(false);

  useEffect(() => {
    const initBoardList = async () => {
      await store.BoardStore.getBoards();
      if (!store.BoardStore.boards) {
        return;
      }
      store.BoardStore.setCurrentBoard(store.BoardStore.boards[0]);
      if (store.BoardStore.currentBoard)
        store.CardStore.getCardsAndOrder(store.BoardStore.currentBoard.id);
    };
    initBoardList();
  }, [store.BoardStore, store.CardStore]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {store.BoardStore.boards ? (
        <ListGroup>
          {store.BoardStore?.boards.map((board: IBoard) => (
            <ListGroupItem
              active={board === store.BoardStore.currentBoard}
              key={board.id}
              onClick={() => {
                store.BoardStore.setCurrentBoard(board);
                store.CardStore.getCardsAndOrder(board.id);
              }}
              className="boardList__board"
            >
              {board.title}
              <DeleteIcon
                className={
                  board === store.BoardStore.currentBoard
                    ? "boardList__deleteIcon_active"
                    : "boardList__deleteIcon_inactive"
                }
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  store.BoardStore.deleteBoard(board.id);
                }}
              />
            </ListGroupItem>
          ))}
        </ListGroup>
      ) : null}
      <Button
        style={{ marginTop: "10px" }}
        variant="outline-primary"
        onClick={() => setCreateBoardVisible(true)}
      >
        + Новая доска
      </Button>
      <CreateBoard
        isShown={createBoardVisible}
        onHide={() => setCreateBoardVisible(false)}
      />
    </div>
  );
};

export default observer(BoardsList);
