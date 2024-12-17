import { Body, Controller, Post } from '@nestjs/common';
import { Endpoints } from 'src/shared/constants/endpoints';
import { TBodyAddContact, TBodyUpdateContact } from './types/types';
import { ContactService } from './contact.service';

@Controller()
export class ContactController {
    constructor(private readonly contactService: ContactService) {}

    @Post(Endpoints.AmoApi.WebHookEvents.add_contact)
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

    @Post(Endpoints.AmoApi.WebHookEvents.update_contact)
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
