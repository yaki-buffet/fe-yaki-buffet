import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { RouteParamsEnum } from '../route-params.enum';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { USER_ID } from '../user-id.token';

@Component({
  selector: 'app-buffet',
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './buffet.component.html',
  styleUrl: './buffet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuffetComponent {
  private readonly firestore = inject(Firestore);

  readonly qrCodeId$ = inject(ActivatedRoute).paramMap.pipe(
    map((paramMap) => paramMap.get(RouteParamsEnum.qrCodeId)),
    filter((qrCodeId) => qrCodeId !== null),
  );

  readonly qrCode$ = this.qrCodeId$.pipe(
    switchMap((qrCodeId) =>
      getDoc(doc(collection(this.firestore, 'qr-codes'), qrCodeId)),
    ),
    map((snapshot) => snapshot.data()),
  );

  readonly order$ = this.qrCodeId$.pipe(
    switchMap((qrCodeId) =>
      getDocs(
        query(
          collection(this.firestore, 'orders'),
          where('qrCodeId', '==', qrCodeId),
          where('stoppedAt', '==', null),
          orderBy('createdAt', 'desc'),
        ),
      ),
    ),
    map((snapshot) => snapshot.docs.map((docSnap) => docSnap.data())),
  );

  readonly userId = inject(USER_ID);
}
