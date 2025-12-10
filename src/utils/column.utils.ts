export const reorderList = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export const moveTaskBetweenColumns = (
    sourceTaskIds: string[],
    destTaskIds: string[],
    sourceIndex: number,
    destIndex: number,
    taskId: string
): { sourceTaskIds: string[]; destTaskIds: string[] } => {
    const newSourceTaskIds = Array.from(sourceTaskIds);
    newSourceTaskIds.splice(sourceIndex, 1);

    const newDestTaskIds = Array.from(destTaskIds);
    newDestTaskIds.splice(destIndex, 0, taskId);

    return {
        sourceTaskIds: newSourceTaskIds,
        destTaskIds: newDestTaskIds,
    };
};
