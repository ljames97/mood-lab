Final:
- typescript and documentation
- tests
- case study

- need to fix scaling issues/aspect ratio between mobile vs desktop
- board cover photo based on recent upload

Challenges:
- modal route using parallel routing, fixed by adding default.tsx into @modals. Also closing modal on logout: disallowed any modals on /auth page but this requires using usePathname which requires useclient which isn't allowed in layout.tsx due to metadata. So needed to use ModalWrapper to deal with pathname and use client and import this into layout.tsx
- fabric version issues with import, deciding on using fabric vs manually creating the editor functionality
- file size issues, using indexedDB instead of local/session storage
- json data to save the state of fabric canvas

(Collaboration: 
- Invite collaborators, realtime database
- Multiple users for one account)