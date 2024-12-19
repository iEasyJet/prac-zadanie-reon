import { Body, Controller, Post } from '@nestjs/common';
import { Endpoints } from 'src/shared/constants/endpoints';
import { TBodyAddContact } from './types/bodyAddContact';
import { ContactService } from './contact.service';
import { TBodyUpdateContact } from './types/bodyUpdateContact';

@Controller(Endpoints.AmoApi.Endpoint.WebHook.WebHook)
export class ContactController {
    private static endpointContactAdd = [
        Endpoints.AmoApi.Endpoint.WebHook.Contact.Contact,
        Endpoints.AmoApi.Endpoint.WebHook.Contact.Next.Add,
    ].join('/');

    private static endpointContactUpdate = [
        Endpoints.AmoApi.Endpoint.WebHook.Contact.Contact,
        Endpoints.AmoApi.Endpoint.WebHook.Contact.Next.Update,
    ].join('/');

    constructor(private readonly contactService: ContactService) {}

    @Post(ContactController.endpointContactAdd)
    public async addContact(@Body() body: TBodyAddContact): Promise<void> {
        const {
            account,
            contacts: { add },
        } = body;
        await this.contactService.addOrUpdateContact({
            account,
            contacts: add,
        });
    }

    @Post(ContactController.endpointContactUpdate)
    public async updateContact(
        @Body() body: TBodyUpdateContact
    ): Promise<void> {
        const {
            account,
            contacts: { update },
        } = body;
        await this.contactService.addOrUpdateContact({
            account,
            contacts: update,
        });
    }
}
