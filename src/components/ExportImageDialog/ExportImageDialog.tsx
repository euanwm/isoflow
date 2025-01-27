import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Button,
  Stack,
  Alert
} from '@mui/material';
import { useSceneStore } from 'src/stores/sceneStore';
import {
  sceneToSceneInput,
  exportAsImage,
  downloadFile as downloadFileUtil,
  getTileScrollPosition,
  base64ToBlob,
  generateGenericFilename
} from 'src/utils';
import { useDiagramUtils } from 'src/hooks/useDiagramUtils';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { Isoflow } from 'src/Isoflow';
import { Loader } from 'src/components/Loader/Loader';

interface Props {
  onClose: () => void;
}

export const ExportImageDialog = ({ onClose }: Props) => {
  const containerRef = useRef<HTMLDivElement>();
  const debounceRef = useRef<NodeJS.Timeout>();
  const [imageData, setImageData] = React.useState<string>();
  const { getUnprojectedBounds, getFitToViewParams } = useDiagramUtils();
  const uiStateActions = useUiStateStore((state) => {
    return state.actions;
  });
  const scene = useSceneStore((state) => {
    return {
      title: state.title,
      nodes: state.nodes,
      connectors: state.connectors,
      textBoxes: state.textBoxes,
      rectangles: state.rectangles,
      icons: state.icons
    };
  });
  const unprojectedBounds = useMemo(() => {
    return getUnprojectedBounds();
  }, [getUnprojectedBounds]);
  const previewParams = useMemo(() => {
    return getFitToViewParams(unprojectedBounds);
  }, [unprojectedBounds, getFitToViewParams]);

  useEffect(() => {
    uiStateActions.setMode({
      type: 'INTERACTIONS_DISABLED',
      showCursor: false
    });
  }, [uiStateActions]);

  const exportImage = useCallback(async () => {
    if (!containerRef.current) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      exportAsImage(containerRef.current as HTMLDivElement).then((data) => {
        return setImageData(data);
      });
    }, 2000);
  }, []);

  const downloadFile = useCallback(() => {
    if (!imageData) return;

    const data = base64ToBlob(
      imageData.replace('data:image/png;base64,', ''),
      'image/png;charset=utf-8'
    );

    downloadFileUtil(data, generateGenericFilename('png'));
  }, [imageData]);

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Export as image</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Alert severity="info">
            <strong>
              Certain browsers may not support exporting images properly.
            </strong>{' '}
            <br />
            For best results, please use the latest version of either Chrome or
            Firefox.
          </Alert>

          {!imageData && (
            <>
              <Box
                sx={{
                  position: 'absolute',
                  width: 0,
                  height: 0,
                  overflow: 'hidden'
                }}
              >
                <Box
                  ref={containerRef}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: unprojectedBounds.width,
                    height: unprojectedBounds.height
                  }}
                >
                  <Isoflow
                    editorMode="NON_INTERACTIVE"
                    onSceneUpdated={exportImage}
                    initialScene={{
                      ...sceneToSceneInput(scene),
                      zoom: previewParams.zoom,
                      scroll: getTileScrollPosition(previewParams.scrollTarget)
                    }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  top: 0,
                  left: 0,
                  width: 500,
                  height: 300,
                  bgcolor: 'common.white'
                }}
              >
                <Loader size={2} />
              </Box>
            </>
          )}

          {imageData && (
            <>
              <Box
                component="img"
                sx={{ width: 900, maxWidth: '100%' }}
                src={imageData}
                alt="preview"
              />
              <Stack alignItems="flex-end">
                <Stack direction="row" spacing={2}>
                  <Button variant="text" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={downloadFile}>Download as PNG</Button>
                </Stack>
              </Stack>
            </>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
