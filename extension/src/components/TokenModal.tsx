import * as React from "../lib/react";
import TokenModalImage from "./TokenModalImage";
import isValidUrl from "../util/isValidUrl";
const { useState } = React;

interface Props {
  images: Array<string>;
  isDisabled: boolean;
  selectedIndex: number;
  onAddNewImage?: (url: string) => Promise<boolean>;
  onToggleDisabled: Function;
  onSelectImage: (url: string) => void;
}

enum NewUrlSubmitState {
  NOT_SUBMITTING,
  SUBMITTING,
  FAILED,
  SUCCEEDED
}

export default function TokenModal(props: Props) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newUrlSubmitState, setNewUrlSubmitState] = useState(
    NewUrlSubmitState.NOT_SUBMITTING
  );
  const [expandedImageUrl, setExpandedImageUrl] = useState(null);
  const [expandedImageHeight, setExpandedImageHeight] = useState(-1);

  function handleAddNew() {
    setIsAddingNew(true);
  }

  function renderImages() {
    return (
      <div
        className={
          "__tokenTagModalImages" + (!!expandedImageUrl ? " __expanded" : "")
        }
        style={
          expandedImageHeight > 0 ? { height: expandedImageHeight + "px" } : {}
        }
      >
        {props.images.map((url, idx) => {
          const isSelected = idx === props.selectedIndex;
          return (
            <TokenModalImage
              isExpanded={expandedImageUrl && url === expandedImageUrl}
              isSelected={isSelected}
              src={url}
              onSelectImage={props.onSelectImage}
              onToggleExpanded={(imgUrl: string, imageHeight: number) => {
                if (expandedImageUrl === url) {
                  setExpandedImageUrl(null);
                  setExpandedImageHeight(-1);
                } else {
                  setExpandedImageUrl(imgUrl);
                  setExpandedImageHeight(imageHeight);
                }
              }}
            />
          );
        })}
        {props.images.length % 2 !== 0 ? <div className="__image" /> : null}
      </div>
    );
  }

  function renderAddNew() {
    const canAddNewImage = !!props.onAddNewImage;

    let content;

    if (canAddNewImage) {
      switch (newUrlSubmitState) {
        case NewUrlSubmitState.FAILED:
        case NewUrlSubmitState.NOT_SUBMITTING:
          content = (
            <div>
              <input
                type="text"
                placeholder="Enter image URL"
                value={newUrl}
                onChange={evt => {
                  setNewUrl(evt.target.value);
                }}
              />
              {newUrlSubmitState === NewUrlSubmitState.FAILED ? (
                <div>
                  Failed to save image. Please check the URL and try again
                </div>
              ) : null}
            </div>
          );
          break;
        case NewUrlSubmitState.SUBMITTING:
          content = <div>Submitting</div>;
          break;
      }
    } else {
      content = <div>To add new memes you must be logged in.</div>;
    }

    return (
      <div className="__tokenTagModalAddNew">
        <div>Add new meme</div>
        {content}
      </div>
    );
  }

  return (
    <div className="__tokenTagModal">
      {isAddingNew ? renderAddNew() : renderImages()}
      <div className="__tokenTagModalButtons">
        {isAddingNew ? (
          <>
            <button
              onClick={async () => {
                setNewUrlSubmitState(NewUrlSubmitState.SUBMITTING);
                const success = await props.onAddNewImage(newUrl);

                setNewUrlSubmitState(
                  success
                    ? NewUrlSubmitState.NOT_SUBMITTING
                    : NewUrlSubmitState.FAILED
                );
                if (success) {
                  setIsAddingNew(false);
                }
              }}
              title={
                isValidUrl(newUrl)
                  ? "Click to submit your awesome new meme"
                  : "Cannot submit, the url you entered is not valid"
              }
              disabled={!isValidUrl(newUrl)}
            >
              Submit
            </button>
            <button
              onClick={() => {
                setIsAddingNew(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            {" "}
            <button onClick={props.onToggleDisabled}>
              {props.isDisabled ? "Enable Tag" : "Disable Tag"}
            </button>
            <button onClick={handleAddNew}>{"Add New"}</button>
          </>
        )}
      </div>
    </div>
  );
}
