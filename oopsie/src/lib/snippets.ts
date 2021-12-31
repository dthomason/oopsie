// for listening to Keyboard with cleanup
//   useEffect(() => {
//     const showAccessory = Keyboard.addListener('keyboardWillShow', () => {
//       setShowAccessView(true);
//     });
//     const hideAccessory = Keyboard.addListener('keyboardWillHide', () => {
//       setShowAccessView(false);
//     });
//
//     return () => {
//       showAccessory.remove();
//       hideAccessory.remove();
//     };
//   }, [setShowAccessView]);
