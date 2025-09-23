export function calculatePosition(cursorPosition: { x: number, y: number }, menuHeight: number): {x: number, y: number} {
    const menuWidth = 288;
    const viewPortWidth = window.innerWidth;
    const viewPortHeight = window.innerHeight;

    const cursorBasedPosition = {
        x: cursorPosition.x + menuWidth > viewPortWidth ? cursorPosition.x - menuWidth : cursorPosition.x,
        y: cursorPosition.y + menuHeight > viewPortHeight ? cursorPosition.y - menuHeight : cursorPosition.y,
    }

    if (cursorBasedPosition.x < 0) cursorBasedPosition.x = 0;
    else if (cursorBasedPosition.x + menuWidth > viewPortWidth) cursorBasedPosition.x = viewPortWidth - menuWidth;

    if (cursorBasedPosition.y < 0) cursorBasedPosition.y = 0;
    else if (cursorBasedPosition.y + menuHeight > viewPortHeight) cursorBasedPosition.y = viewPortHeight - menuHeight;

    return cursorBasedPosition;
}